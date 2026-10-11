package com.neeramoy.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    private String orderId;

    private String customerId;

    private List<OrderItem> items;
    private DeliveryDetails deliveryDetails;

    private String deliveryMethod;
    private String paymentMethod;
    
    private String status;
    private String paymentStatus;
    
    private double subtotal;
    private double deliveryCharge;
    private double discount;
    private double total;

    // Payment tracking fields
    private String tranId;
    private String valId;
    private String bankTranId;
    private String cardType;
    private LocalDateTime paidAt;
    private String paymentUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
