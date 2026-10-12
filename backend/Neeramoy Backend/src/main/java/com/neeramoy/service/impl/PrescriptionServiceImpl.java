package com.neeramoy.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.neeramoy.dto.prescription.PrescriptionResponseDto;
import com.neeramoy.dto.prescription.PrescriptionReviewRequestDto;
import com.neeramoy.enums.PrescriptionStatus;
import com.neeramoy.model.Prescription;
import com.neeramoy.model.User;
import com.neeramoy.repository.PrescriptionRepository;
import com.neeramoy.repository.UserRepository;
import com.neeramoy.service.PrescriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private static final Logger logger = LoggerFactory.getLogger(PrescriptionServiceImpl.class);
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public PrescriptionResponseDto uploadPrescription(MultipartFile file, String customerId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Prescription file is required and cannot be empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 5MB.");
        }

        byte[] fileBytes = file.getBytes();
        String detectedMimeType = detectMimeType(fileBytes);
        if (detectedMimeType == null) {
            throw new IllegalArgumentException("Invalid file format. Only authentic JPEG, PNG, and PDF files are allowed.");
        }

        User customer = userRepository.findById(customerId).orElse(null);
        String customerName = customer != null ? customer.getFullName() : "Customer";
        String customerPhone = customer != null ? customer.getPhone() : "";

        // Cloudinary upload parameters
        Map<String, Object> uploadParams = new HashMap<>();
        uploadParams.put("folder", "neeramoy/prescriptions");
        boolean isPdf = "application/pdf".equals(detectedMimeType);
        uploadParams.put("resource_type", isPdf ? "auto" : "image");

        Map<?, ?> uploadResult = cloudinary.uploader().upload(fileBytes, uploadParams);

        String fileUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");
        String resourceType = (String) uploadResult.get("resource_type");
        if (resourceType == null) {
            resourceType = isPdf ? "raw" : "image";
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            originalFilename = isPdf ? "prescription.pdf" : "prescription.jpg";
        }

        LocalDateTime now = LocalDateTime.now();
        Prescription prescription = Prescription.builder()
                .customerId(customerId)
                .customerName(customerName)
                .customerPhone(customerPhone)
                .fileUrl(fileUrl)
                .filePublicId(publicId)
                .fileName(originalFilename)
                .fileType(detectedMimeType)
                .resourceType(resourceType)
                .status(PrescriptionStatus.PENDING) // Always starts as PENDING
                .createdAt(now)
                .updatedAt(now)
                .build();

        Prescription saved = prescriptionRepository.save(prescription);
        return mapToDto(saved);
    }

    @Override
    public List<PrescriptionResponseDto> getCustomerPrescriptions(String customerId) {
        return prescriptionRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PrescriptionResponseDto getPrescriptionById(String id, String currentUserId, boolean isAdminOrStaff) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + id));

        if (!isAdminOrStaff && !prescription.getCustomerId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not authorized to access this prescription.");
        }

        return mapToDto(prescription);
    }

    @Override
    public void deletePrescription(String id, String currentUserId, boolean isAdminOrStaff) throws IOException {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + id));

        if (!isAdminOrStaff && !prescription.getCustomerId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not authorized to delete this prescription.");
        }

        if (!isAdminOrStaff && prescription.getStatus() == PrescriptionStatus.APPROVED) {
            throw new IllegalStateException("Cannot delete an already approved prescription.");
        }

        // Delete asset from Cloudinary
        String publicId = prescription.getFilePublicId();
        if (publicId != null && !publicId.trim().isEmpty()) {
            try {
                Map<String, Object> deleteParams = new HashMap<>();
                if (prescription.getResourceType() != null && !prescription.getResourceType().trim().isEmpty()) {
                    deleteParams.put("resource_type", prescription.getResourceType());
                }
                cloudinary.uploader().destroy(publicId, deleteParams);
            } catch (Exception ex) {
                logger.warn("Failed to delete Cloudinary file with publicId: {}", publicId, ex);
            }
        }

        prescriptionRepository.delete(prescription);
    }

    @Override
    public List<PrescriptionResponseDto> getAllPrescriptionsAdmin(PrescriptionStatus status) {
        List<Prescription> list = (status != null)
                ? prescriptionRepository.findByStatusOrderByCreatedAtDesc(status)
                : prescriptionRepository.findAllByOrderByCreatedAtDesc();

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public PrescriptionResponseDto reviewPrescription(String id, PrescriptionReviewRequestDto request, String reviewerId, String reviewerName) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + id));

        if (prescription.getStatus() != PrescriptionStatus.PENDING) {
            throw new IllegalStateException("Prescription has already been reviewed (current status: " + prescription.getStatus() + ").");
        }

        if (request == null || request.getStatus() == null) {
            throw new IllegalArgumentException("Target review status (APPROVED or REJECTED) is required.");
        }

        PrescriptionStatus newStatus = request.getStatus();
        if (newStatus == PrescriptionStatus.PENDING) {
            throw new IllegalArgumentException("Cannot transition a prescription back to PENDING.");
        }

        if (newStatus == PrescriptionStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty()) {
                throw new IllegalArgumentException("Rejection reason is required when rejecting a prescription.");
            }
            prescription.setRejectionReason(request.getRejectionReason().trim());
        } else {
            prescription.setRejectionReason(null);
        }

        LocalDateTime now = LocalDateTime.now();
        prescription.setStatus(newStatus);
        prescription.setReviewerId(reviewerId);
        prescription.setReviewerName(reviewerName);
        prescription.setReviewedAt(now);
        prescription.setUpdatedAt(now);

        Prescription updated = prescriptionRepository.save(prescription);
        return mapToDto(updated);
    }

    /**
     * Inspect file magic bytes to verify genuine file type independently of client-reported MIME type.
     */
    static String detectMimeType(byte[] bytes) {
        if (bytes == null || bytes.length < 4) {
            return null;
        }

        // JPEG: FF D8 FF
        if ((bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }

        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (bytes.length >= 8
                && (bytes[0] & 0xFF) == 0x89
                && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47
                && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A) {
            return "image/png";
        }

        // PDF: %PDF- (0x25 0x50 0x44 0x46 0x2D)
        if (bytes.length >= 5
                && bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] == 0x46 && bytes[4] == 0x2D) {
            return "application/pdf";
        }

        return null;
    }

    private PrescriptionResponseDto mapToDto(Prescription entity) {
        return PrescriptionResponseDto.builder()
                .id(entity.getId())
                .customerId(entity.getCustomerId())
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .fileUrl(entity.getFileUrl())
                .fileName(entity.getFileName())
                .fileType(entity.getFileType())
                .status(entity.getStatus())
                .rejectionReason(entity.getRejectionReason())
                .reviewerId(entity.getReviewerId())
                .reviewerName(entity.getReviewerName())
                .reviewedAt(entity.getReviewedAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
