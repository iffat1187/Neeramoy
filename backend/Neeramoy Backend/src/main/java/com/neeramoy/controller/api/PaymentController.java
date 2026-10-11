package com.neeramoy.controller.api;

import com.neeramoy.dto.payment.PaymentInitiateResponse;
import com.neeramoy.model.Order;
import com.neeramoy.payment.sslcommerz.SSLCommerzService;
import com.neeramoy.security.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/payment/sslcommerz")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private SSLCommerzService sslCommerzService;

    @Value("${app.frontend-url:${FRONTEND_BASE_URL:https://neeramoy.netlify.app}}")
    private String frontendUrl;

    private String getCleanFrontendUrl() {
        if (frontendUrl == null) return "https://neeramoy.netlify.app";
        return frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
    }

    @PostMapping("/success")
    public ResponseEntity<Void> handleSuccess(@RequestParam Map<String, String> payload) {
        log.info("SSLCommerz success callback invoked with payload keys: {}", payload.keySet());
        String redirectUrl;
        try {
            Order order = sslCommerzService.processSuccess(payload);
            String orderId = order != null ? (order.getOrderId() != null ? order.getOrderId() : order.getId()) : "";
            redirectUrl = getCleanFrontendUrl() + "/order-confirmation?orderId=" + orderId + "&payment=success";
        } catch (Exception e) {
            log.error("Failed to process success callback: {}", e.getMessage(), e);
            String tranId = payload.get("tran_id");
            redirectUrl = getCleanFrontendUrl() + "/order-confirmation?payment=failed&tranId=" + (tranId != null ? tranId : "") + "&error=" + URLEncoder.encode(e.getMessage() != null ? e.getMessage() : "Payment verification failed", StandardCharsets.UTF_8);
        }
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
    }

    @PostMapping("/fail")
    public ResponseEntity<Void> handleFail(@RequestParam Map<String, String> payload) {
        log.warn("SSLCommerz fail callback invoked: {}", payload);
        Order order = sslCommerzService.processFail(payload);
        String orderId = order != null ? (order.getOrderId() != null ? order.getOrderId() : order.getId()) : "";
        String redirectUrl = getCleanFrontendUrl() + "/order-confirmation?orderId=" + orderId + "&payment=failed";
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
    }

    @PostMapping("/cancel")
    public ResponseEntity<Void> handleCancel(@RequestParam Map<String, String> payload) {
        log.warn("SSLCommerz cancel callback invoked: {}", payload);
        Order order = sslCommerzService.processCancel(payload);
        String orderId = order != null ? (order.getOrderId() != null ? order.getOrderId() : order.getId()) : "";
        String redirectUrl = getCleanFrontendUrl() + "/order-confirmation?orderId=" + orderId + "&payment=cancelled";
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
    }

    @PostMapping("/ipn")
    public ResponseEntity<String> handleIpn(@RequestParam Map<String, String> payload) {
        log.info("SSLCommerz IPN callback invoked: {}", payload);
        try {
            sslCommerzService.processIpn(payload);
            return ResponseEntity.ok("IPN Handled");
        } catch (Exception e) {
            log.error("IPN handling error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("IPN Error: " + e.getMessage());
        }
    }

    @PostMapping("/initiate/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentInitiateResponse> initiatePayment(@PathVariable String orderId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String customerId = userDetails.getId();
        
        log.info("Customer {} initiating payment retry for order {}", customerId, orderId);
        String paymentUrl = sslCommerzService.retryPayment(orderId, customerId);
        
        return ResponseEntity.ok(PaymentInitiateResponse.builder()
                .orderId(orderId)
                .paymentUrl(paymentUrl)
                .build());
    }
}
