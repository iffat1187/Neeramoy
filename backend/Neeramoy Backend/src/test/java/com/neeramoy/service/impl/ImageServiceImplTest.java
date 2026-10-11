package com.neeramoy.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ImageServiceImplTest {

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @InjectMocks
    private ImageServiceImpl imageService;

    @BeforeEach
    void setUp() {
        // leniency to avoid strict stubbing exceptions if a test doesn't use it
        lenient().when(cloudinary.uploader()).thenReturn(uploader);
    }

    @Test
    void uploadImage_validFile_success() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "test image content".getBytes()
        );

        Map<String, Object> mockResult = new HashMap<>();
        mockResult.put("secure_url", "https://res.cloudinary.com/test/image.jpg");
        mockResult.put("public_id", "test_public_id");

        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(mockResult);

        Map<String, String> result = imageService.uploadImage(file);

        assertNotNull(result);
        assertEquals("https://res.cloudinary.com/test/image.jpg", result.get("url"));
        assertEquals("test_public_id", result.get("publicId"));
        verify(uploader, times(1)).upload(any(byte[].class), anyMap());
    }

    @Test
    void uploadImage_emptyFile_throwsException() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", new byte[0]
        );

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            imageService.uploadImage(file);
        });

        assertEquals("File is empty", exception.getMessage());
    }

    @Test
    void uploadImage_invalidType_throwsException() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.txt", "text/plain", "text content".getBytes()
        );

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            imageService.uploadImage(file);
        });

        assertTrue(exception.getMessage().contains("Invalid file type"));
    }

    @Test
    void uploadImage_largeFile_throwsException() {
        byte[] largeContent = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile file = new MockMultipartFile(
                "file", "large.jpg", "image/jpeg", largeContent
        );

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            imageService.uploadImage(file);
        });

        assertTrue(exception.getMessage().contains("File size exceeds limit"));
    }

    @Test
    void deleteImage_validPublicId_success() throws IOException {
        Map<String, Object> mockResult = new HashMap<>();
        when(uploader.destroy(eq("test_public_id"), anyMap())).thenReturn(mockResult);

        assertDoesNotThrow(() -> imageService.deleteImage("test_public_id"));
        verify(uploader, times(1)).destroy(eq("test_public_id"), anyMap());
    }
}
