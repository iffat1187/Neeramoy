package com.neeramoy.dto.order;

import com.neeramoy.model.DeliveryDetails;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDto {
    private List<OrderItemDto> items;
    private DeliveryDetails deliveryDetails;
    private String deliveryMethod;
    private String paymentMethod;
}
