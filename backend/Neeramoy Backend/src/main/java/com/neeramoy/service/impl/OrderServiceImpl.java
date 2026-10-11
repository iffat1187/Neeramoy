package com.neeramoy.service.impl;

import com.neeramoy.dto.order.OrderItemDto;
import com.neeramoy.dto.order.OrderRequestDto;
import com.neeramoy.model.Medicine;
import com.neeramoy.model.Order;
import com.neeramoy.model.OrderItem;
import com.neeramoy.repository.MedicineRepository;
import com.neeramoy.repository.OrderRepository;
import com.neeramoy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired(required = false)
    private com.neeramoy.payment.sslcommerz.SSLCommerzService sslCommerzService;

    @Override
    public Order createOrder(OrderRequestDto request, String customerId) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item.");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0;
        double discount = 0; // Not fully implemented in requirements, using 0 for now or calculating from medicine discount

        for (OrderItemDto itemDto : request.getItems()) {
            if (itemDto.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero for item ID: " + itemDto.getId());
            }

            Medicine medicine = medicineRepository.findById(itemDto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Medicine not found with ID: " + itemDto.getId()));

            if (!medicine.isInStock()) {
                throw new IllegalArgumentException("Medicine is out of stock: " + medicine.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .medicineId(medicine.getId())
                    .name(medicine.getName())
                    .price(medicine.getPrice())
                    .quantity(itemDto.getQuantity())
                    .image(medicine.getImage())
                    .build();

            orderItems.add(orderItem);
            subtotal += medicine.getPrice() * itemDto.getQuantity();
            
            // If the medicine itself has a discount property, we could accumulate it here
            // discount += medicine.getDiscount() * itemDto.getQuantity(); 
        }

        double deliveryCharge = 60.0; // standard
        if ("express".equalsIgnoreCase(request.getDeliveryMethod())) {
            deliveryCharge = 120.0;
        }

        double total = subtotal + deliveryCharge - discount;

        String orderId = "ORD-" + (100000 + (int)(Math.random() * 900000));

        boolean isOnlinePayment = "online".equalsIgnoreCase(request.getPaymentMethod()) || "sslcommerz".equalsIgnoreCase(request.getPaymentMethod());
        if (isOnlinePayment) {
            if (request.getDeliveryDetails() == null || 
                request.getDeliveryDetails().getPostalCode() == null || 
                request.getDeliveryDetails().getPostalCode().trim().isEmpty()) {
                throw new IllegalArgumentException("Shipping postal code is required for online payment.");
            }
        }
        String tranId = isOnlinePayment ? "TXN-" + orderId + "-" + System.currentTimeMillis() : null;

        Order order = Order.builder()
                .orderId(orderId)
                .tranId(tranId)
                .customerId(customerId)
                .items(orderItems)
                .deliveryDetails(request.getDeliveryDetails())
                .deliveryMethod(request.getDeliveryMethod())
                .paymentMethod(request.getPaymentMethod())
                .status("Pending")
                .paymentStatus("Pending")
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .discount(discount)
                .total(total)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        if (isOnlinePayment && sslCommerzService != null) {
            com.neeramoy.dto.payment.SSLCommerzInitResponse initRes = sslCommerzService.initiatePayment(savedOrder);
            if (initRes != null && "SUCCESS".equalsIgnoreCase(initRes.getStatus()) && initRes.getGatewayPageURL() != null) {
                savedOrder.setPaymentUrl(initRes.getGatewayPageURL());
                savedOrder = orderRepository.save(savedOrder);
            } else {
                String reason = initRes != null && initRes.getFailedreason() != null ? initRes.getFailedreason() : "Gateway session error";
                throw new IllegalStateException("Online payment initiation failed: " + reason);
            }
        }

        return savedOrder;
    }

    @Override
    public List<Order> getOrdersByCustomer(String customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        enrichOrderItems(orders);
        return orders;
    }

    @Override
    public Order getOrderByIdAndCustomer(String orderId, String customerId) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getCustomerId().equals(customerId))
                .orElseGet(() -> orderRepository.findAll().stream()
                        .filter(o -> (orderId.equals(o.getId()) || orderId.equals(o.getOrderId())) && customerId.equals(o.getCustomerId()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Order not found or access denied")));
        enrichOrderItem(order);
        return order;
    }

    @Override
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        enrichOrderItems(orders);
        return orders;
    }

    @Override
    public Order getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseGet(() -> orderRepository.findAll().stream()
                        .filter(o -> o.getId().equals(id) || o.getOrderId().equals(id))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Order not found")));
        enrichOrderItem(order);
        return order;
    }

    private void enrichOrderItems(List<Order> orders) {
        if (orders != null) {
            for (Order o : orders) {
                enrichOrderItem(o);
            }
        }
    }

    private void enrichOrderItem(Order order) {
        if (order != null && order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                if ((item.getImage() == null || item.getImage().isBlank()) && item.getMedicineId() != null) {
                    medicineRepository.findById(item.getMedicineId())
                            .ifPresent(med -> item.setImage(med.getImage()));
                }
            }
        }
    }

    @Override
    public Order cancelOrder(String orderId, String customerId) {
        Order order = getOrderByIdAndCustomer(orderId, customerId);
        if ("Shipped".equalsIgnoreCase(order.getStatus()) || "Delivered".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Cannot cancel an order that has already been shipped or delivered.");
        }
        order.setStatus("Cancelled");
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(String orderId, String status) {
        Order order = getOrderById(orderId);
        
        List<String> validStatuses = List.of("Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled");
        if (!validStatuses.contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        
        if ("Cancelled".equalsIgnoreCase(order.getStatus()) || "Delivered".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Cannot change status of an order that is already " + order.getStatus() + ".");
        }
        
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}
