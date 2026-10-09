package com.neeramoy.service.impl;

import com.neeramoy.dto.auth.AuthResponse;
import com.neeramoy.dto.auth.LoginRequest;
import com.neeramoy.dto.auth.RegisterRequest;
import com.neeramoy.dto.auth.UserDTO;
import com.neeramoy.enums.Role;
import com.neeramoy.model.User;
import com.neeramoy.repository.UserRepository;
import com.neeramoy.security.JwtUtils;
import com.neeramoy.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        if (registerRequest.getEmail() != null && !registerRequest.getEmail().isEmpty()) {
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw new RuntimeException("Error: Email is already in use!");
            }
        }
        
        if (userRepository.existsByPhone(registerRequest.getPhone())) {
            throw new RuntimeException("Error: Phone number is already in use!");
        }

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .phone(registerRequest.getPhone())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.CUSTOMER) // Default role, NEVER allow choosing ADMIN
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .message("User registered successfully")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseGet(() -> userRepository.findByPhone(loginRequest.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email/phone")));

        UserDTO userDTO = UserDTO.builder()
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .addresses(new ArrayList<>())
                .address(user.getAddress() != null ? user.getAddress() : "")
                .city(user.getCity() != null ? user.getCity() : "")
                .area(user.getArea() != null ? user.getArea() : "")
                .postalCode(user.getPostalCode() != null ? user.getPostalCode() : "")
                .build();

        return AuthResponse.builder()
                .token(jwt)
                .user(userDTO)
                .message("Login successful")
                .build();
    }

    @Override
    public UserDTO getMe(String username) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByPhone(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username")));
                        
        return UserDTO.builder()
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .addresses(new ArrayList<>())
                .address(user.getAddress() != null ? user.getAddress() : "")
                .city(user.getCity() != null ? user.getCity() : "")
                .area(user.getArea() != null ? user.getArea() : "")
                .postalCode(user.getPostalCode() != null ? user.getPostalCode() : "")
                .build();
    }
}
