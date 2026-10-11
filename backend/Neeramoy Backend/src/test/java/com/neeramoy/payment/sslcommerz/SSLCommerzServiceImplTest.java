package com.neeramoy.payment.sslcommerz;

import com.neeramoy.dto.payment.SSLCommerzInitResponse;
import com.neeramoy.dto.payment.SSLCommerzValidatorResponse;
import com.neeramoy.model.DeliveryDetails;
import com.neeramoy.model.Order;
import com.neeramoy.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SSLCommerzServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RestTemplate restTemplate;

    private SSLCommerzServiceImpl sslCommerzService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sslCommerzService = new SSLCommerzServiceImpl(orderRepository, restTemplate);
        sslCommerzService.setStoreId("testbox");
        sslCommerzService.setStorePassword("qwerty");
        sslCommerzService.setApiUrl("https://sandbox.sslcommerz.com");
        sslCommerzService.setBackendUrl("http://localhost:10000");
        sslCommerzService.setFrontendUrl("https://neeramoy.netlify.app");

        sampleOrder = Order.builder()
                .id("order_mongo_id_1")
                .orderId("ORD-123456")
                .customerId("cust_1")
                .tranId("TXN-ORD-123456-1000")
                .total(250.00)
                .subtotal(190.00)
                .deliveryCharge(60.00)
                .status("Pending")
                .paymentStatus("Pending")
                .paymentMethod("online")
                .deliveryDetails(DeliveryDetails.builder()
                        .fullName("Rahim Uddin")
                        .phone("01711223344")
                        .email("rahim@example.com")
                        .address("House 10, Dhanmondi")
                        .city("Dhaka")
                        .postalCode("1205")
                        .build())
                .build();
    }

    @Test
    void initiatePayment_success_returnsGatewayUrl() {
        SSLCommerzInitResponse mockInitRes = SSLCommerzInitResponse.builder()
                .status("SUCCESS")
                .gatewayPageURL("https://sandbox.sslcommerz.com/EasyCheckOut/testsession123")
                .sessionkey("testsession123")
                .build();

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(SSLCommerzInitResponse.class)))
                .thenReturn(ResponseEntity.ok(mockInitRes));

        SSLCommerzInitResponse result = sslCommerzService.initiatePayment(sampleOrder);

        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
        assertEquals("https://sandbox.sslcommerz.com/EasyCheckOut/testsession123", result.getGatewayPageURL());

        org.mockito.ArgumentCaptor<HttpEntity> captor = org.mockito.ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate, times(1)).postForEntity(contains("/gwprocess/v4/api.php"), captor.capture(), eq(SSLCommerzInitResponse.class));
        org.springframework.util.MultiValueMap<String, String> capturedParams = (org.springframework.util.MultiValueMap<String, String>) captor.getValue().getBody();
        assertNotNull(capturedParams);
        assertEquals("1205", capturedParams.getFirst("ship_postcode"));
        assertEquals("1205", capturedParams.getFirst("cus_postcode"));
        assertEquals("Dhaka", capturedParams.getFirst("ship_city"));
        assertEquals("House 10, Dhanmondi", capturedParams.getFirst("ship_add1"));
        assertEquals("YES", capturedParams.getFirst("shipping_method"));
    }

    @Test
    void processSuccess_validPayment_marksOrderPaidAndPreservesPendingStatus() {
        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        SSLCommerzValidatorResponse mockValidatorRes = SSLCommerzValidatorResponse.builder()
                .status("VALID")
                .tran_id("TXN-ORD-123456-1000")
                .val_id("VAL-999")
                .amount("250.00")
                .currency("BDT")
                .bank_tran_id("BANK-111")
                .card_type("VISA-Dutch-Bangla Bank")
                .build();

        when(restTemplate.getForObject(contains("validator/api/validationserverAPI.php"), eq(SSLCommerzValidatorResponse.class)))
                .thenReturn(mockValidatorRes);

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");
        payload.put("val_id", "VAL-999");

        Order updated = sslCommerzService.processSuccess(payload);

        assertNotNull(updated);
        assertEquals("Paid", updated.getPaymentStatus());
        assertEquals("VAL-999", updated.getValId());
        assertEquals("BANK-111", updated.getBankTranId());
        assertEquals("VISA-Dutch-Bangla Bank", updated.getCardType());
        assertNotNull(updated.getPaidAt());
        // Preserves admin approval requirement: status must remain Pending!
        assertEquals("Pending", updated.getStatus());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void processSuccess_duplicateCallback_isIdempotentAndDoesNotDuplicateSave() {
        sampleOrder.setPaymentStatus("Paid");
        sampleOrder.setValId("VAL-999");

        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");
        payload.put("val_id", "VAL-999");

        Order result = sslCommerzService.processSuccess(payload);

        assertEquals("Paid", result.getPaymentStatus());
        // Validation API should NOT be called again for an already Paid order
        verify(restTemplate, never()).getForObject(anyString(), any());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void processSuccess_amountMismatchWithBigDecimal_marksPaymentFailed() {
        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        // Gateway reports amount 100.00 while order is 250.00
        SSLCommerzValidatorResponse mockValidatorRes = SSLCommerzValidatorResponse.builder()
                .status("VALID")
                .tran_id("TXN-ORD-123456-1000")
                .val_id("VAL-999")
                .amount("100.00")
                .currency("BDT")
                .build();

        when(restTemplate.getForObject(contains("validator/api/validationserverAPI.php"), eq(SSLCommerzValidatorResponse.class)))
                .thenReturn(mockValidatorRes);

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");
        payload.put("val_id", "VAL-999");

        Order result = sslCommerzService.processSuccess(payload);

        assertEquals("Failed", result.getPaymentStatus());
        assertNotEquals("Paid", result.getPaymentStatus());
    }

    @Test
    void processSuccess_currencyMismatch_marksPaymentFailed() {
        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        SSLCommerzValidatorResponse mockValidatorRes = SSLCommerzValidatorResponse.builder()
                .status("VALID")
                .tran_id("TXN-ORD-123456-1000")
                .val_id("VAL-999")
                .amount("250.00")
                .currency("USD") // Not BDT!
                .build();

        when(restTemplate.getForObject(contains("validator/api/validationserverAPI.php"), eq(SSLCommerzValidatorResponse.class)))
                .thenReturn(mockValidatorRes);

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");
        payload.put("val_id", "VAL-999");

        Order result = sslCommerzService.processSuccess(payload);

        assertEquals("Failed", result.getPaymentStatus());
    }

    @Test
    void processSuccess_invalidGatewayStatus_marksPaymentFailed() {
        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        SSLCommerzValidatorResponse mockValidatorRes = SSLCommerzValidatorResponse.builder()
                .status("INVALID_TRANSACTION")
                .tran_id("TXN-ORD-123456-1000")
                .val_id("VAL-999")
                .amount("250.00")
                .currency("BDT")
                .build();

        when(restTemplate.getForObject(contains("validator/api/validationserverAPI.php"), eq(SSLCommerzValidatorResponse.class)))
                .thenReturn(mockValidatorRes);

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");
        payload.put("val_id", "VAL-999");

        Order result = sslCommerzService.processSuccess(payload);

        assertEquals("Failed", result.getPaymentStatus());
    }

    @Test
    void processFail_marksPaymentFailed() {
        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");

        Order result = sslCommerzService.processFail(payload);

        assertNotNull(result);
        assertEquals("Failed", result.getPaymentStatus());
    }

    @Test
    void processFail_neverDowngradesAlreadyPaidOrder() {
        sampleOrder.setPaymentStatus("Paid");

        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");

        Order result = sslCommerzService.processFail(payload);

        assertNotNull(result);
        assertEquals("Paid", result.getPaymentStatus());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void processCancel_neverDowngradesAlreadyPaidOrder() {
        sampleOrder.setPaymentStatus("Paid");

        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");

        Order result = sslCommerzService.processCancel(payload);

        assertNotNull(result);
        assertEquals("Paid", result.getPaymentStatus());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void processIpn_validIpn_verifiesAndMarksPaid() {
        when(orderRepository.findByTranId("TXN-ORD-123456-1000")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        SSLCommerzValidatorResponse mockValidatorRes = SSLCommerzValidatorResponse.builder()
                .status("VALID")
                .tran_id("TXN-ORD-123456-1000")
                .val_id("VAL-999")
                .amount("250.00")
                .currency("BDT")
                .build();

        when(restTemplate.getForObject(contains("validator/api/validationserverAPI.php"), eq(SSLCommerzValidatorResponse.class)))
                .thenReturn(mockValidatorRes);

        Map<String, String> payload = new HashMap<>();
        payload.put("tran_id", "TXN-ORD-123456-1000");
        payload.put("val_id", "VAL-999");

        Order result = sslCommerzService.processIpn(payload);

        assertNotNull(result);
        assertEquals("Paid", result.getPaymentStatus());
    }

    @Test
    void retryPayment_unpaidOrder_generatesNewTranIdAndUrl() {
        sampleOrder.setPaymentStatus("Failed");

        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        SSLCommerzInitResponse mockInitRes = SSLCommerzInitResponse.builder()
                .status("SUCCESS")
                .gatewayPageURL("https://sandbox.sslcommerz.com/EasyCheckOut/retrysession456")
                .build();

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(SSLCommerzInitResponse.class)))
                .thenReturn(ResponseEntity.ok(mockInitRes));

        String paymentUrl = sslCommerzService.retryPayment("order_mongo_id_1", "cust_1");

        assertEquals("https://sandbox.sslcommerz.com/EasyCheckOut/retrysession456", paymentUrl);
        assertTrue(sampleOrder.getTranId().startsWith("TXN-ORD-123456-"));
    }

    @Test
    void retryPayment_alreadyPaid_throwsException() {
        sampleOrder.setPaymentStatus("Paid");
        when(orderRepository.findById("order_mongo_id_1")).thenReturn(Optional.of(sampleOrder));

        assertThrows(IllegalStateException.class, () -> {
            sslCommerzService.retryPayment("order_mongo_id_1", "cust_1");
        });
    }

    @Test
    void initiatePayment_missingStoreId_throwsIllegalStateException() {
        sslCommerzService.setStoreId("");
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            sslCommerzService.initiatePayment(sampleOrder);
        });
        assertTrue(ex.getMessage().contains("credentials are not configured"));
        verify(restTemplate, never()).postForEntity(anyString(), any(), any());
    }

    @Test
    void initiatePayment_missingStorePassword_throwsIllegalStateException() {
        sslCommerzService.setStorePassword(null);
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            sslCommerzService.initiatePayment(sampleOrder);
        });
        assertTrue(ex.getMessage().contains("credentials are not configured"));
        verify(restTemplate, never()).postForEntity(anyString(), any(), any());
    }

    @Test
    void validateTransaction_missingCredentials_throwsIllegalStateException() {
        sslCommerzService.setStoreId(null);
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            sslCommerzService.validateTransaction("VAL-1234");
        });
        assertTrue(ex.getMessage().contains("credentials are not configured"));
        verify(restTemplate, never()).getForObject(anyString(), any());
    }

    @Test
    void initiatePayment_gatewayCommunicationFailure_throwsIllegalStateException() {
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(SSLCommerzInitResponse.class)))
                .thenThrow(new org.springframework.web.client.RestClientException("Connection refused"));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            sslCommerzService.initiatePayment(sampleOrder);
        });
        assertTrue(ex.getMessage().contains("Failed to initiate payment session"));
    }

    @Test
    void initiatePayment_missingPostalCode_throwsIllegalArgumentException() {
        sampleOrder.getDeliveryDetails().setPostalCode(null);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            sslCommerzService.initiatePayment(sampleOrder);
        });
        assertTrue(ex.getMessage().contains("Shipping postal code is required for online payment."));
        verify(restTemplate, never()).postForEntity(anyString(), any(), any());
    }

    @Test
    void initiatePayment_blankPostalCode_throwsIllegalArgumentException() {
        sampleOrder.getDeliveryDetails().setPostalCode("   ");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            sslCommerzService.initiatePayment(sampleOrder);
        });
        assertTrue(ex.getMessage().contains("Shipping postal code is required for online payment."));
        verify(restTemplate, never()).postForEntity(anyString(), any(), any());
    }
}
