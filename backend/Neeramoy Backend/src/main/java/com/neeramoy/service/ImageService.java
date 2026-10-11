package com.neeramoy.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

public interface ImageService {
    Map<String, String> uploadImage(MultipartFile file) throws IOException;
    void deleteImage(String publicId) throws IOException;
}
