package com.neeramoy.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDetails {
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String area;
    private String postalCode;
    private String instructions;
}
