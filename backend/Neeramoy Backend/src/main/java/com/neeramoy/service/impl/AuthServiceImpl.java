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
import com.neeramoy.service.ImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private ImageService imageService;

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

        return AuthResponse.builder()
                .token(jwt)
                .user(mapToUserDTO(user))
                .message("Login successful")
                .build();
    }

    @Override
    public UserDTO getMe(String username) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByPhone(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username")));
                        
        return mapToUserDTO(user);
    }

    @Override
    public UserDTO updateProfilePicture(String username, MultipartFile file) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByPhone(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username)));

        Map<String, String> uploadResult;
        try {
            uploadResult = imageService.uploadImage(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture: " + e.getMessage(), e);
        }

        String oldPublicId = user.getProfileImagePublicId();
        String newImageUrl = uploadResult.get("url");
        String newPublicId = uploadResult.get("publicId");

        // 1. Persist new image first
        user.setProfileImage(newImageUrl);
        user.setProfileImagePublicId(newPublicId);
        userRepository.save(user);

        // 2. Safely attempt to delete old image if present
        if (oldPublicId != null && !oldPublicId.trim().isEmpty()) {
            try {
                imageService.deleteImage(oldPublicId);
            } catch (Exception ex) {
                logger.warn("Failed to delete old Cloudinary profile image with publicId: {}", oldPublicId, ex);
            }
        }

        return mapToUserDTO(user);
    }

    private UserDTO mapToUserDTO(User user) {
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
                .profileImage(user.getProfileImage() != null ? user.getProfileImage() : "")
                .profileImagePublicId(user.getProfileImagePublicId() != null ? user.getProfileImagePublicId() : "")
                .build();
    }
}
