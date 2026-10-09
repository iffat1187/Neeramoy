package com.neeramoy.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email or phone is required")
    private String email; // Field is called email in frontend even if it can be phone

    @NotBlank(message = "Password is required")
    private String password;
}
