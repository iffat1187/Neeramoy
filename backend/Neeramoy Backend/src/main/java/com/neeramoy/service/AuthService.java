package com.neeramoy.service;

import com.neeramoy.dto.auth.AuthResponse;
import com.neeramoy.dto.auth.LoginRequest;
import com.neeramoy.dto.auth.RegisterRequest;
import com.neeramoy.dto.auth.UserDTO;

import org.springframework.web.multipart.MultipartFile;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    UserDTO getMe(String username);
    UserDTO updateProfilePicture(String username, MultipartFile file);
}
