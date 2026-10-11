package com.neeramoy.service.impl;

import com.neeramoy.dto.auth.UserDTO;
import com.neeramoy.enums.Role;
import com.neeramoy.model.User;
import com.neeramoy.repository.UserRepository;
import com.neeramoy.service.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private MockMultipartFile sampleFile;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id("u1")
                .fullName("Test User")
                .email("test@example.com")
                .phone("01711111111")
                .role(Role.CUSTOMER)
                .address("123 Street")
                .city("Dhaka")
                .build();

        sampleFile = new MockMultipartFile(
                "file", "avatar.jpg", "image/jpeg", "image-data".getBytes()
        );
    }

    @Test
    void updateProfilePicture_firstTime_success() throws IOException {
        Map<String, String> uploadResult = new HashMap<>();
        uploadResult.put("url", "https://cloudinary.com/avatar1.jpg");
        uploadResult.put("publicId", "profiles/avatar1");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(imageService.uploadImage(sampleFile)).thenReturn(uploadResult);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO result = authService.updateProfilePicture("test@example.com", sampleFile);

        assertNotNull(result);
        assertEquals("https://cloudinary.com/avatar1.jpg", result.getProfileImage());
        assertEquals("profiles/avatar1", result.getProfileImagePublicId());
        assertEquals("Test User", result.getName());
        verify(imageService, never()).deleteImage(anyString());
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    void updateProfilePicture_replaceExisting_deletesOldImageSafely() throws IOException {
        sampleUser.setProfileImage("https://cloudinary.com/old.jpg");
        sampleUser.setProfileImagePublicId("profiles/old_id");

        Map<String, String> uploadResult = new HashMap<>();
        uploadResult.put("url", "https://cloudinary.com/new.jpg");
        uploadResult.put("publicId", "profiles/new_id");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(imageService.uploadImage(sampleFile)).thenReturn(uploadResult);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO result = authService.updateProfilePicture("test@example.com", sampleFile);

        assertNotNull(result);
        assertEquals("https://cloudinary.com/new.jpg", result.getProfileImage());
        assertEquals("profiles/new_id", result.getProfileImagePublicId());
        verify(imageService, times(1)).deleteImage("profiles/old_id");
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    void updateProfilePicture_oldImageDeletionFails_doesNotFailUpdate() throws IOException {
        sampleUser.setProfileImage("https://cloudinary.com/old.jpg");
        sampleUser.setProfileImagePublicId("profiles/old_id");

        Map<String, String> uploadResult = new HashMap<>();
        uploadResult.put("url", "https://cloudinary.com/new.jpg");
        uploadResult.put("publicId", "profiles/new_id");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(imageService.uploadImage(sampleFile)).thenReturn(uploadResult);
        doThrow(new RuntimeException("Cloudinary network timeout")).when(imageService).deleteImage("profiles/old_id");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO result = assertDoesNotThrow(() -> authService.updateProfilePicture("test@example.com", sampleFile));

        assertNotNull(result);
        assertEquals("https://cloudinary.com/new.jpg", result.getProfileImage());
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    void updateProfilePicture_userNotFound_throwsException() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("unknown@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                authService.updateProfilePicture("unknown@example.com", sampleFile)
        );
    }

    @Test
    void getMe_returnsProfileImage() {
        sampleUser.setProfileImage("https://cloudinary.com/avatar.jpg");
        sampleUser.setProfileImagePublicId("profiles/avatar");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));

        UserDTO result = authService.getMe("test@example.com");

        assertNotNull(result);
        assertEquals("https://cloudinary.com/avatar.jpg", result.getProfileImage());
        assertEquals("profiles/avatar", result.getProfileImagePublicId());
    }
}
