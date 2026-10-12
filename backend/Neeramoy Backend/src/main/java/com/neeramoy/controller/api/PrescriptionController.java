package com.neeramoy.controller.api;

import com.neeramoy.dto.prescription.PrescriptionResponseDto;
import com.neeramoy.dto.prescription.PrescriptionReviewRequestDto;
import com.neeramoy.enums.PrescriptionStatus;
import com.neeramoy.security.UserDetailsImpl;
import com.neeramoy.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrescriptionResponseDto> uploadPrescription(@RequestParam("file") MultipartFile file) throws IOException {
        String customerId = getAuthenticatedUserId();
        PrescriptionResponseDto response = prescriptionService.uploadPrescription(file, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PrescriptionResponseDto>> getMyPrescriptions() {
        String customerId = getAuthenticatedUserId();
        List<PrescriptionResponseDto> list = prescriptionService.getCustomerPrescriptions(customerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrescriptionResponseDto> getPrescriptionById(@PathVariable String id) {
        String currentUserId = getAuthenticatedUserId();
        boolean isAdminOrStaff = hasAdminOrStaffRole();
        PrescriptionResponseDto response = prescriptionService.getPrescriptionById(id, currentUserId, isAdminOrStaff);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deletePrescription(@PathVariable String id) throws IOException {
        String currentUserId = getAuthenticatedUserId();
        boolean isAdminOrStaff = hasAdminOrStaffRole();
        prescriptionService.deletePrescription(id, currentUserId, isAdminOrStaff);
        return ResponseEntity.ok(Map.of("message", "Prescription deleted successfully."));
    }

    // Admin endpoint aliases under /api/prescriptions/admin/**
    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACY_STAFF')")
    public ResponseEntity<List<PrescriptionResponseDto>> getAllPrescriptionsAdmin(
            @RequestParam(value = "status", required = false) PrescriptionStatus status) {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptionsAdmin(status));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACY_STAFF')")
    public ResponseEntity<PrescriptionResponseDto> getAdminPrescriptionById(@PathVariable String id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id, getAuthenticatedUserId(), true));
    }

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACY_STAFF')")
    public ResponseEntity<PrescriptionResponseDto> updatePrescriptionStatusAdmin(
            @PathVariable String id,
            @RequestBody PrescriptionReviewRequestDto request) {
        String reviewerId = getAuthenticatedUserId();
        String reviewerName = getAuthenticatedUserName();
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
        return "Staff";
    }

    private boolean hasAdminOrStaffRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities() == null) return false;
        return auth.getAuthorities().stream().anyMatch(a ->
                "ROLE_ADMIN".equals(a.getAuthority()) || "ROLE_PHARMACY_STAFF".equals(a.getAuthority()));
    }
}
