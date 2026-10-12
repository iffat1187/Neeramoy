package com.neeramoy.controller.admin;

import com.neeramoy.dto.prescription.PrescriptionResponseDto;
import com.neeramoy.dto.prescription.PrescriptionReviewRequestDto;
import com.neeramoy.enums.PrescriptionStatus;
import com.neeramoy.security.UserDetailsImpl;
import com.neeramoy.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/prescriptions")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACY_STAFF')")
public class AdminPrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping
    public ResponseEntity<List<PrescriptionResponseDto>> getAllPrescriptions(
            @RequestParam(value = "status", required = false) PrescriptionStatus status) {
        List<PrescriptionResponseDto> list = prescriptionService.getAllPrescriptionsAdmin(status);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponseDto> getPrescriptionById(@PathVariable String id) {
        String reviewerId = getAuthenticatedUserId();
        PrescriptionResponseDto response = prescriptionService.getPrescriptionById(id, reviewerId, true);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<PrescriptionResponseDto> reviewPrescription(
            @PathVariable String id,
            @RequestBody PrescriptionReviewRequestDto request) {
        String reviewerId = getAuthenticatedUserId();
        String reviewerName = getAuthenticatedUserName();
        PrescriptionResponseDto updated = prescriptionService.reviewPrescription(id, request, reviewerId, reviewerName);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<PrescriptionResponseDto> approvePrescription(@PathVariable String id) {
        String reviewerId = getAuthenticatedUserId();
        String reviewerName = getAuthenticatedUserName();
        PrescriptionReviewRequestDto request = PrescriptionReviewRequestDto.builder()
                .status(PrescriptionStatus.APPROVED)
                .build();
        PrescriptionResponseDto updated = prescriptionService.reviewPrescription(id, request, reviewerId, reviewerName);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<PrescriptionResponseDto> rejectPrescription(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String reviewerId = getAuthenticatedUserId();
        String reviewerName = getAuthenticatedUserName();
        String reason = payload != null ? payload.getOrDefault("rejectionReason", payload.get("reason")) : null;

        PrescriptionReviewRequestDto request = PrescriptionReviewRequestDto.builder()
                .status(PrescriptionStatus.REJECTED)
                .rejectionReason(reason)
                .build();
        PrescriptionResponseDto updated = prescriptionService.reviewPrescription(id, request, reviewerId, reviewerName);
        return ResponseEntity.ok(updated);
    }

    private String getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
            return userDetails.getId();
        }
        throw new IllegalStateException("User is not authenticated");
    }

    private String getAuthenticatedUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
            if (userDetails.getUser() != null && userDetails.getUser().getFullName() != null) {
                return userDetails.getUser().getFullName();
            }
            return userDetails.getUsername();
        }
        return "Admin";
    }
}
