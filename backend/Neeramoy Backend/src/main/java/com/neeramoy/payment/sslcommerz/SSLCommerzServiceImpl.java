package com.neeramoy.payment.sslcommerz;

import com.neeramoy.dto.payment.SSLCommerzInitResponse;
import com.neeramoy.dto.payment.SSLCommerzValidatorResponse;
import com.neeramoy.model.Order;
import com.neeramoy.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;

@Service
public class SSLCommerzServiceImpl implements SSLCommerzService {

    private static final Logger log = LoggerFactory.getLogger(SSLCommerzServiceImpl.class);

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    @Value("${payment.sslcommerz.store-id:}")
    private String storeId;

    @Value("${payment.sslcommerz.store-password:}")
    private String storePassword;

    @Value("${payment.sslcommerz.is-sandbox:true}")
    private boolean isSandbox;

    @Value("${payment.sslcommerz.api-url:https://sandbox.sslcommerz.com}")
    private String apiUrl;

    @Value("${payment.sslcommerz.backend-url:${BACKEND_BASE_URL:http://localhost:10000}}")
    private String backendUrl;

    @Value("${payment.sslcommerz.success-url:}")
    private String configuredSuccessUrl;

    @Value("${payment.sslcommerz.fail-url:}")
    private String configuredFailUrl;

    @Value("${payment.sslcommerz.cancel-url:}")
    private String configuredCancelUrl;

    @Value("${payment.sslcommerz.ipn-url:}")
    private String configuredIpnUrl;

    @Value("${app.frontend-url:${FRONTEND_BASE_URL:https://neeramoy.netlify.app}}")
    private String frontendUrl;

    @Autowired
    public SSLCommerzServiceImpl(OrderRepository orderRepository, @Autowired(required = false) RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate != null ? restTemplate : new RestTemplate();
    }

    // Setters for unit testing
    public void setStoreId(String storeId) { this.storeId = storeId; }
    public void setStorePassword(String storePassword) { this.storePassword = storePassword; }
    public void setApiUrl(String apiUrl) { this.apiUrl = apiUrl; }
    public void setBackendUrl(String backendUrl) { this.backendUrl = backendUrl; }
    public void setFrontendUrl(String frontendUrl) { this.frontendUrl = frontendUrl; }

    public boolean isConfigured() {
        return storeId != null && !storeId.trim().isEmpty() &&
               storePassword != null && !storePassword.trim().isEmpty();
    }

    public String getEffectiveSuccessUrl() {
        if (configuredSuccessUrl != null && !configuredSuccessUrl.trim().isEmpty()) {
            return configuredSuccessUrl.trim();
        }
        return removeTrailingSlash(backendUrl) + "/api/payment/sslcommerz/success";
    }

    public String getEffectiveFailUrl() {
        if (configuredFailUrl != null && !configuredFailUrl.trim().isEmpty()) {
            return configuredFailUrl.trim();
        }
        return removeTrailingSlash(backendUrl) + "/api/payment/sslcommerz/fail";
    }

    public String getEffectiveCancelUrl() {
        if (configuredCancelUrl != null && !configuredCancelUrl.trim().isEmpty()) {
            return configuredCancelUrl.trim();
        }
        return removeTrailingSlash(backendUrl) + "/api/payment/sslcommerz/cancel";
    }

    public String getEffectiveIpnUrl() {
        if (configuredIpnUrl != null && !configuredIpnUrl.trim().isEmpty()) {
            return configuredIpnUrl.trim();
        }
        return removeTrailingSlash(backendUrl) + "/api/payment/sslcommerz/ipn";
    }

    public String getFrontendUrl() {
        return removeTrailingSlash(frontendUrl);
    }

    private String removeTrailingSlash(String url) {
        if (url == null) return "";
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    @Override
    public SSLCommerzInitResponse initiatePayment(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null for payment initiation");
        }

        if (!isConfigured()) {
            log.error("SSLCommerz payment initiation aborted: store_id or store_password is not configured.");
            throw new IllegalStateException("Online payment is currently unavailable: SSLCommerz store credentials are not configured. Please configure SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD or choose Cash on Delivery.");
        }

        String sessionEndpoint = removeTrailingSlash(apiUrl) + "/gwprocess/v4/api.php";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();
        requestParams.add("store_id", storeId.trim());
        requestParams.add("store_passwd", storePassword.trim());
        requestParams.add("total_amount", String.format(Locale.US, "%.2f", order.getTotal()));
        requestParams.add("currency", "BDT");
        requestParams.add("tran_id", order.getTranId());
        
        requestParams.add("success_url", getEffectiveSuccessUrl());
        requestParams.add("fail_url", getEffectiveFailUrl());
        requestParams.add("cancel_url", getEffectiveCancelUrl());
        requestParams.add("ipn_url", getEffectiveIpnUrl());

        // Customer details
        String customerName = "Customer";
        String customerEmail = "customer@neeramoy.com";
        String customerPhone = "01700000000";
        String customerAddress = "Dhaka";
        String customerCity = "Dhaka";
        String customerPostcode = null;

        if (order.getDeliveryDetails() != null) {
            if (order.getDeliveryDetails().getFullName() != null && !order.getDeliveryDetails().getFullName().isBlank()) {
                customerName = order.getDeliveryDetails().getFullName().trim();
            }
            if (order.getDeliveryDetails().getEmail() != null && !order.getDeliveryDetails().getEmail().isBlank()) {
                customerEmail = order.getDeliveryDetails().getEmail().trim();
            }
            if (order.getDeliveryDetails().getPhone() != null && !order.getDeliveryDetails().getPhone().isBlank()) {
                customerPhone = order.getDeliveryDetails().getPhone().trim();
            }
            if (order.getDeliveryDetails().getAddress() != null && !order.getDeliveryDetails().getAddress().isBlank()) {
                customerAddress = order.getDeliveryDetails().getAddress().trim();
            }
            if (order.getDeliveryDetails().getCity() != null && !order.getDeliveryDetails().getCity().isBlank()) {
                customerCity = order.getDeliveryDetails().getCity().trim();
            }
            if (order.getDeliveryDetails().getPostalCode() != null && !order.getDeliveryDetails().getPostalCode().isBlank()) {
                customerPostcode = order.getDeliveryDetails().getPostalCode().trim();
            }
        }

        if (customerPostcode == null || customerPostcode.isEmpty()) {
            log.error("SSLCommerz payment initiation aborted for order {}: shipping postal code is missing.", order.getOrderId());
            throw new IllegalArgumentException("Shipping postal code is required for online payment.");
        }

        requestParams.add("cus_name", customerName);
        requestParams.add("cus_email", customerEmail);
        requestParams.add("cus_phone", customerPhone);
        requestParams.add("cus_add1", customerAddress);
        requestParams.add("cus_city", customerCity);
        requestParams.add("cus_postcode", customerPostcode);
        requestParams.add("cus_country", "Bangladesh");

        // Shipping details
        requestParams.add("shipping_method", "YES");
        requestParams.add("num_of_item", String.valueOf(order.getItems() != null ? order.getItems().size() : 1));
        requestParams.add("ship_name", customerName);
        requestParams.add("ship_add1", customerAddress);
        requestParams.add("ship_city", customerCity);
        requestParams.add("ship_postcode", customerPostcode);
        requestParams.add("ship_country", "Bangladesh");

        // Product information
        requestParams.add("product_name", "Medicines & Healthcare");
        requestParams.add("product_category", "Healthcare");
        requestParams.add("product_profile", "general");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestParams, headers);

        try {
            log.info("Initiating SSLCommerz payment session for order {} (tranId: {})", order.getOrderId(), order.getTranId());
            ResponseEntity<SSLCommerzInitResponse> response = restTemplate.postForEntity(
                    sessionEndpoint,
                    requestEntity,
                    SSLCommerzInitResponse.class
            );

            SSLCommerzInitResponse body = response.getBody();
            if (body != null && "SUCCESS".equalsIgnoreCase(body.getStatus()) && body.getGatewayPageURL() != null) {
                log.info("SSLCommerz session created successfully for order {}. GatewayPageURL received.", order.getOrderId());
                return body;
            } else {
                String reason = body != null ? body.getFailedreason() : "No response body from SSLCommerz";
                log.error("SSLCommerz session initialization failed for order {}: {}", order.getOrderId(), reason);
                return body;
            }
        } catch (IllegalStateException | IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error communicating with SSLCommerz session endpoint: {}", e.getMessage());
            throw new IllegalStateException("Failed to initiate payment session with SSLCommerz: " + e.getMessage(), e);
        }
    }

    @Override
    public SSLCommerzValidatorResponse validateTransaction(String valId) {
        if (valId == null || valId.trim().isEmpty()) {
            throw new IllegalArgumentException("val_id is required for validation");
        }

        if (!isConfigured()) {
            log.error("SSLCommerz transaction validation aborted: store_id or store_password is not configured.");
            throw new IllegalStateException("SSLCommerz store credentials are not configured.");
        }

        String validationUrl = String.format(
                "%s/validator/api/validationserverAPI.php?val_id=%s&store_id=%s&store_passwd=%s&v=1&format=json",
                removeTrailingSlash(apiUrl),
                valId.trim(),
                storeId.trim(),
                storePassword.trim()
        );

        try {
            log.info("Querying SSLCommerz Order Validation API for val_id: {}", valId);
            return restTemplate.getForObject(validationUrl, SSLCommerzValidatorResponse.class);
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to query SSLCommerz validation API for val_id {}: {}", valId, e.getMessage());
            throw new IllegalStateException("SSLCommerz validation query failed: " + e.getMessage(), e);
        }
    }

    @Override
    public Order processSuccess(Map<String, String> payload) {
        String tranId = getParam(payload, "tran_id");
        String valId = getParam(payload, "val_id");

        log.info("Processing SSLCommerz success callback for tranId: {}, valId: {}", tranId, valId);

        Order order = findOrderByTranId(tranId);
        if (order == null) {
            log.error("Order not found for tranId: {}", tranId);
            throw new IllegalArgumentException("Order not found for transaction ID: " + tranId);
        }

        synchronized (order.getId().intern()) {
            // Re-fetch latest state to protect against concurrent callbacks
            order = orderRepository.findById(order.getId()).orElse(order);

            // Duplicate-callback protection: If already paid, do not re-process
            if ("Paid".equalsIgnoreCase(order.getPaymentStatus())) {
                log.info("Order {} is already marked as Paid. Duplicate callback ignored safely.", order.getOrderId());
                return order;
            }

            if (valId == null || valId.isBlank()) {
                log.error("Missing val_id in success callback for order {}", order.getOrderId());
                order.setPaymentStatus("Failed");
                order.setUpdatedAt(LocalDateTime.now());
                return orderRepository.save(order);
            }

            SSLCommerzValidatorResponse valRes = validateTransaction(valId);
            if (valRes == null) {
                log.error("Null validation response received from SSLCommerz for order {}", order.getOrderId());
                order.setPaymentStatus("Failed");
                order.setUpdatedAt(LocalDateTime.now());
                return orderRepository.save(order);
            }

            // 1. Verify Gateway Status
            String gatewayStatus = valRes.getStatus();
            if (!"VALID".equalsIgnoreCase(gatewayStatus) && !"VALIDATED".equalsIgnoreCase(gatewayStatus)) {
                log.error("Gateway validation status invalid: '{}' for order {}", gatewayStatus, order.getOrderId());
                order.setPaymentStatus("Failed");
                order.setUpdatedAt(LocalDateTime.now());
                return orderRepository.save(order);
            }

            // 2. Verify Transaction ID & Order Association
            if (valRes.getTran_id() == null || !valRes.getTran_id().equals(order.getTranId())) {
                log.error("Transaction ID mismatch. Expected '{}', got '{}'", order.getTranId(), valRes.getTran_id());
                order.setPaymentStatus("Failed");
                order.setUpdatedAt(LocalDateTime.now());
                return orderRepository.save(order);
            }

            // 3. Verify Currency
            if (valRes.getCurrency() == null || !"BDT".equalsIgnoreCase(valRes.getCurrency().trim())) {
                log.error("Currency mismatch. Expected BDT, got '{}'", valRes.getCurrency());
                order.setPaymentStatus("Failed");
                order.setUpdatedAt(LocalDateTime.now());
                return orderRepository.save(order);
            }

            // 4. Verify Amount using BigDecimal for exact precision
            try {
                BigDecimal gatewayAmount = new BigDecimal(valRes.getAmount()).setScale(2, RoundingMode.HALF_UP);
                BigDecimal orderAmount = BigDecimal.valueOf(order.getTotal()).setScale(2, RoundingMode.HALF_UP);
                if (gatewayAmount.compareTo(orderAmount) != 0) {
                    log.error("Amount mismatch for order {}. Expected: {}, Gateway reported: {}",
                            order.getOrderId(), orderAmount, gatewayAmount);
                    order.setPaymentStatus("Failed");
                    order.setUpdatedAt(LocalDateTime.now());
                    return orderRepository.save(order);
                }
            } catch (Exception ex) {
                log.error("Error parsing amount for order {}: {}", order.getOrderId(), ex.getMessage());
                order.setPaymentStatus("Failed");
                order.setUpdatedAt(LocalDateTime.now());
                return orderRepository.save(order);
            }

            // 5. All validations passed! Mark as Paid.
            // Requirement 5: Preserve existing admin approval workflow. Order status remains Pending!
            order.setPaymentStatus("Paid");
            order.setValId(valId);
            order.setBankTranId(valRes.getBank_tran_id());
            order.setCardType(valRes.getCard_type());
            order.setPaidAt(LocalDateTime.now());
            order.setUpdatedAt(LocalDateTime.now());

            log.info("Payment successfully verified and marked Paid for order {}", order.getOrderId());
            return orderRepository.save(order);
        }
    }

    @Override
    public Order processFail(Map<String, String> payload) {
        String tranId = getParam(payload, "tran_id");
        log.warn("Processing SSLCommerz fail callback for tranId: {}", tranId);

        Order order = findOrderByTranId(tranId);
        if (order == null) {
            log.error("Order not found for failed transaction: {}", tranId);
            return null;
        }

        synchronized (order.getId().intern()) {
            order = orderRepository.findById(order.getId()).orElse(order);
            // Requirement 4: Never downgrade an already verified Paid order
            if ("Paid".equalsIgnoreCase(order.getPaymentStatus())) {
                log.warn("Order {} is already Paid. Refusing to downgrade on fail callback.", order.getOrderId());
                return order;
            }

            order.setPaymentStatus("Failed");
            order.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        }
    }

    @Override
    public Order processCancel(Map<String, String> payload) {
        String tranId = getParam(payload, "tran_id");
        log.warn("Processing SSLCommerz cancel callback for tranId: {}", tranId);

        Order order = findOrderByTranId(tranId);
        if (order == null) {
            log.error("Order not found for cancelled transaction: {}", tranId);
            return null;
        }

        synchronized (order.getId().intern()) {
            order = orderRepository.findById(order.getId()).orElse(order);
            // Requirement 4: Never downgrade an already verified Paid order
            if ("Paid".equalsIgnoreCase(order.getPaymentStatus())) {
                log.warn("Order {} is already Paid. Refusing to downgrade on cancel callback.", order.getOrderId());
                return order;
            }

            order.setPaymentStatus("Cancelled");
            order.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        }
    }

    @Override
    public Order processIpn(Map<String, String> payload) {
        log.info("Received SSLCommerz IPN callback: {}", payload);
        return processSuccess(payload);
    }

    @Override
    public String retryPayment(String orderId, String customerId) {
        Order order = orderRepository.findById(orderId)
                .orElseGet(() -> orderRepository.findByOrderId(orderId)
                        .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId)));

        if (customerId != null && !customerId.equals(order.getCustomerId())) {
            throw new IllegalArgumentException("Access denied: You do not own this order.");
        }

        if ("Paid".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new IllegalStateException("Order is already paid.");
        }

        // Generate fresh transaction ID for retry
        String newTranId = "TXN-" + order.getOrderId() + "-" + System.currentTimeMillis();
        order.setTranId(newTranId);
        order.setPaymentMethod("online");

        SSLCommerzInitResponse initResponse = initiatePayment(order);
        if (initResponse != null && "SUCCESS".equalsIgnoreCase(initResponse.getStatus()) && initResponse.getGatewayPageURL() != null) {
            order.setPaymentUrl(initResponse.getGatewayPageURL());
            orderRepository.save(order);
            return initResponse.getGatewayPageURL();
        } else {
            String errorMsg = initResponse != null ? initResponse.getFailedreason() : "Unable to initiate payment session";
            throw new IllegalStateException("SSLCommerz retry failed: " + errorMsg);
        }
    }

    private Order findOrderByTranId(String tranId) {
        if (tranId == null || tranId.isBlank()) {
            return null;
        }
        return orderRepository.findByTranId(tranId)
                .orElseGet(() -> {
                    // Fallback: If tranId starts with TXN-<orderId>-..., try extracting orderId
                    if (tranId.startsWith("TXN-")) {
                        String[] parts = tranId.split("-");
                        if (parts.length >= 2) {
                            String possibleOrderId = parts[1];
                            return orderRepository.findByOrderId(possibleOrderId).orElse(null);
                        }
                    }
                    return null;
                });
    }

    private String getParam(Map<String, String> payload, String key) {
        if (payload == null) return null;
        String val = payload.get(key);
        if (val == null) {
            // Check uppercase or case-insensitive
            for (Map.Entry<String, String> entry : payload.entrySet()) {
                if (entry.getKey().equalsIgnoreCase(key)) {
                    return entry.getValue();
                }
            }
        }
        return val;
    }
}
