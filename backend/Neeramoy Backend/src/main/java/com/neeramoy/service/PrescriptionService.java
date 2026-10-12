package com.neeramoy.service;

import com.neeramoy.dto.prescription.PrescriptionResponseDto;
import com.neeramoy.dto.prescription.PrescriptionReviewRequestDto;
import com.neeramoy.enums.PrescriptionStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PrescriptionService {
    PrescriptionResponseDto uploadPrescription(MultipartFile file, String customerId) throws IOException;

    List<PrescriptionResponseDto> getCustomerPrescriptions(String customerId);

    PrescriptionResponseDto getPrescriptionById(String id, String currentUserId, boolean isAdminOrStaff);

    void deletePrescription(String id, String currentUserId, boolean isAdminOrStaff) throws IOException;

    List<PrescriptionResponseDto> getAllPrescriptionsAdmin(PrescriptionStatus status);

    PrescriptionResponseDto reviewPrescription(String id, PrescriptionReviewRequestDto request, String reviewerId, String reviewerName);
}
