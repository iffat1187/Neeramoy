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

        Order order = Order.builder()
                .orderId(orderId)
                .customerId(customerId)
                .items(orderItems)
                .deliveryDetails(request.getDeliveryDetails())
                .deliveryMethod(request.getDeliveryMethod())
                .paymentMethod(request.getPaymentMethod())
                .status("Pending")
                .paymentStatus("cod".equalsIgnoreCase(request.getPaymentMethod()) ? "Pending" : "Pending")
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .discount(discount)
                .total(total)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @Override
    public Order getOrderByIdAndCustomer(String orderId, String customerId) {
        return orderRepository.findById(orderId)
                .filter(o -> o.getCustomerId().equals(customerId))
                .orElseGet(() -> orderRepository.findAll().stream()
                        .filter(o -> (orderId.equals(o.getId()) || orderId.equals(o.getOrderId())) && customerId.equals(o.getCustomerId()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Order not found or access denied")));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseGet(() -> orderRepository.findAll().stream()
                        .filter(o -> o.getId().equals(id) || o.getOrderId().equals(id))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Order not found")));
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
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}
