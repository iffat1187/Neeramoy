package com.neeramoy.service;

import com.neeramoy.dto.order.OrderRequestDto;
import com.neeramoy.model.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequestDto request, String customerId);
    List<Order> getOrdersByCustomer(String customerId);
    Order getOrderByIdAndCustomer(String orderId, String customerId);
    List<Order> getAllOrders();
    Order getOrderById(String id);
    Order cancelOrder(String orderId, String customerId);
    Order updateOrderStatus(String orderId, String status);
}
