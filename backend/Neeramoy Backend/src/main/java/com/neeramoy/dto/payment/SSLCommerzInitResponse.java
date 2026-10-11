package com.neeramoy.dto.payment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SSLCommerzInitResponse {
    private String status;
    private String failedreason;
    private String sessionkey;

    @JsonProperty("GatewayPageURL")
    private String gatewayPageURL;
}
