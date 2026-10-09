package com.neeramoy.dto.auth;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDTO {
    private String name; // mapped from fullName for frontend
    private String email;
    private String phone;
    private String role;
    private List<Object> addresses; // Placeholder empty array
    private String address;
    private String city;
    private String area;
    private String postalCode;
}
