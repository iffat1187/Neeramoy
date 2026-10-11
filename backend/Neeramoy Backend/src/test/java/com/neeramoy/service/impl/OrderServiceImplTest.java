package com.neeramoy.service.impl;

import com.neeramoy.dto.order.OrderItemDto;
import com.neeramoy.dto.order.OrderRequestDto;
import com.neeramoy.model.DeliveryDetails;
import com.neeramoy.model.Medicine;
import com.neeramoy.model.Order;
import com.neeramoy.repository.MedicineRepository;
import com.neeramoy.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private MedicineRepository medicineRepository;

    @Mock
    private com.neeramoy.payment.sslcommerz.SSLCommerzService sslCommerzService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private OrderRequestDto validRequest;
    private Medicine validMedicine;

    @BeforeEach
    void setUp() {
        OrderItemDto itemDto = new OrderItemDto();
        itemDto.setId("med1");
        itemDto.setQuantity(2);

        validRequest = new OrderRequestDto();
        validRequest.setItems(Collections.singletonList(itemDto));
        validRequest.setDeliveryMethod("standard");
        validRequest.setPaymentMethod("cod");
        validRequest.setDeliveryDetails(new DeliveryDetails());

        validMedicine = Medicine.builder()
                .id("med1")
                .name("Napa")
                .price(10.0)
                .inStock(true)
                .build();
    }

    @Test
    void createOrder_validRequest_success() {
        when(medicineRepository.findById("med1")).thenReturn(Optional.of(validMedicine));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order order = orderService.createOrder(validRequest, "cust1");

        assertNotNull(order);
        assertEquals("cust1", order.getCustomerId());
        assertEquals(1, order.getItems().size());
        assertEquals("Napa", order.getItems().get(0).getName());
        assertEquals(20.0, order.getSubtotal()); // 10.0 * 2
        assertEquals(60.0, order.getDeliveryCharge());
        assertEquals(80.0, order.getTotal());
        assertNotNull(order.getOrderId());
        assertEquals("Pending", order.getStatus());
    }

    @Test
    void createOrder_invalidMedicineId_throwsException() {
        when(medicineRepository.findById("med1")).thenReturn(Optional.empty());

        Exception e = assertThrows(IllegalArgumentException.class, () -> {
            orderService.createOrder(validRequest, "cust1");
        });
        assertTrue(e.getMessage().contains("not found"));
    }

    @Test
    void createOrder_invalidQuantity_throwsException() {
        validRequest.getItems().get(0).setQuantity(0);

        Exception e = assertThrows(IllegalArgumentException.class, () -> {
            orderService.createOrder(validRequest, "cust1");
        });
        assertTrue(e.getMessage().contains("Quantity must be greater than zero"));
    }

    @Test
    void createOrder_outOfStock_throwsException() {
        validMedicine.setInStock(false);
        when(medicineRepository.findById("med1")).thenReturn(Optional.of(validMedicine));

        Exception e = assertThrows(IllegalArgumentException.class, () -> {
            orderService.createOrder(validRequest, "cust1");
        });
        assertTrue(e.getMessage().contains("out of stock"));
    }

    @Test
    void createOrder_expressDelivery_correctCalculation() {
        validRequest.setDeliveryMethod("express");
        when(medicineRepository.findById("med1")).thenReturn(Optional.of(validMedicine));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order order = orderService.createOrder(validRequest, "cust1");

        assertEquals(120.0, order.getDeliveryCharge());
        assertEquals(140.0, order.getTotal());
    }

    @Test
    void getOrderByIdAndCustomer_authorized_success() {
        Order order = new Order();
        order.setId("ord1");
        order.setCustomerId("cust1");

        when(orderRepository.findById("ord1")).thenReturn(Optional.of(order));

        Order result = orderService.getOrderByIdAndCustomer("ord1", "cust1");
        assertEquals("ord1", result.getId());
    }

    @Test
    void getOrderByIdAndCustomer_unauthorized_throwsException() {
        Order order = new Order();
        order.setId("ord1");
        order.setCustomerId("cust1");

        when(orderRepository.findById("ord1")).thenReturn(Optional.of(order));

        Exception e = assertThrows(IllegalArgumentException.class, () -> {
            orderService.getOrderByIdAndCustomer("ord1", "cust2");
        });
        assertTrue(e.getMessage().contains("not found or access denied"));
    }

    @Test
    void updateOrderStatus_validStatus_success() {
        Order order = new Order();
        order.setId("ord1");
        order.setStatus("Pending");
        when(orderRepository.findById("ord1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order result = orderService.updateOrderStatus("ord1", "Shipped");
        assertEquals("Shipped", result.getStatus());
    }

    @Test
    void updateOrderStatus_invalidStatus_throwsException() {
        Order order = new Order();
        order.setId("ord1");
        order.setStatus("Pending");
        when(orderRepository.findById("ord1")).thenReturn(Optional.of(order));

        assertThrows(IllegalArgumentException.class, () -> {
            orderService.updateOrderStatus("ord1", "InvalidStatus");
        });
    }

    @Test
    void updateOrderStatus_alreadyCancelled_throwsException() {
        Order order = new Order();
        order.setId("ord1");
        order.setStatus("Cancelled");
        when(orderRepository.findById("ord1")).thenReturn(Optional.of(order));

        assertThrows(IllegalStateException.class, () -> {
            orderService.updateOrderStatus("ord1", "Shipped");
        });
    }

    @Test
    void updateOrderStatus_alreadyDelivered_throwsException() {
        Order order = new Order();
        order.setId("ord1");
        order.setStatus("Delivered");
        when(orderRepository.findById("ord1")).thenReturn(Optional.of(order));

        assertThrows(IllegalStateException.class, () -> {
            orderService.updateOrderStatus("ord1", "Shipped");
        });
    }

    @Test
    void createOrder_onlinePayment_initiatesGatewaySession() {
        validRequest.setPaymentMethod("online");
        validRequest.getDeliveryDetails().setPostalCode("1205");
        when(medicineRepository.findById("med1")).thenReturn(Optional.of(validMedicine));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        com.neeramoy.dto.payment.SSLCommerzInitResponse initRes = com.neeramoy.dto.payment.SSLCommerzInitResponse.builder()
                .status("SUCCESS")
                .gatewayPageURL("https://sandbox.sslcommerz.com/EasyCheckOut/session123")
                .build();
        when(sslCommerzService.initiatePayment(any(Order.class))).thenReturn(initRes);

        Order order = orderService.createOrder(validRequest, "cust1");

        assertNotNull(order);
        assertNotNull(order.getTranId());
        assertTrue(order.getTranId().startsWith("TXN-"));
        assertEquals("https://sandbox.sslcommerz.com/EasyCheckOut/session123", order.getPaymentUrl());
        assertEquals("Pending", order.getStatus());
        assertEquals("Pending", order.getPaymentStatus());
        verify(sslCommerzService, times(1)).initiatePayment(any(Order.class));
    }

    @Test
    void createOrder_codPayment_doesNotCallSSLCommerz() {
        validRequest.setPaymentMethod("cod");
        when(medicineRepository.findById("med1")).thenReturn(Optional.of(validMedicine));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order order = orderService.createOrder(validRequest, "cust1");

        assertNotNull(order);
        assertNull(order.getTranId());
        assertNull(order.getPaymentUrl());
        assertEquals("Pending", order.getStatus());
        assertEquals("Pending", order.getPaymentStatus());
        verify(sslCommerzService, never()).initiatePayment(any(Order.class));
    }

    @Test
    void createOrder_onlinePayment_gatewayFailure_throwsIllegalStateException() {
        validRequest.setPaymentMethod("online");
        validRequest.getDeliveryDetails().setPostalCode("1205");
        when(medicineRepository.findById("med1")).thenReturn(Optional.of(validMedicine));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        com.neeramoy.dto.payment.SSLCommerzInitResponse failedRes = com.neeramoy.dto.payment.SSLCommerzInitResponse.builder()
                .status("FAILED")
                .failedreason("Invalid Information! 'store_id' is missing or empty.")
                .build();
        when(sslCommerzService.initiatePayment(any(Order.class))).thenReturn(failedRes);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            orderService.createOrder(validRequest, "cust1");
        });
        assertTrue(ex.getMessage().contains("Online payment initiation failed: Invalid Information! 'store_id' is missing or empty."));
    }

    @Test
    void createOrder_onlinePayment_missingPostalCode_throwsIllegalArgumentException() {
        validRequest.setPaymentMethod("online");
        validRequest.getDeliveryDetails().setPostalCode(null);
        when(medicineRepository.findById("med1")).thenReturn(Optional.of(validMedicine));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            orderService.createOrder(validRequest, "cust1");
        });
        assertTrue(ex.getMessage().contains("Shipping postal code is required for online payment."));
        verify(sslCommerzService, never()).initiatePayment(any());
    }
}
