package com.neeramoy.payment.sslcommerz;

import com.neeramoy.dto.payment.SSLCommerzInitResponse;
import com.neeramoy.dto.payment.SSLCommerzValidatorResponse;
import com.neeramoy.model.Order;

import java.util.Map;

public interface SSLCommerzService {
    SSLCommerzInitResponse initiatePayment(Order order);
    SSLCommerzValidatorResponse validateTransaction(String valId);
    Order processSuccess(Map<String, String> payload);
    Order processFail(Map<String, String> payload);
    Order processCancel(Map<String, String> payload);
    Order processIpn(Map<String, String> payload);
    String retryPayment(String orderId, String customerId);
}
