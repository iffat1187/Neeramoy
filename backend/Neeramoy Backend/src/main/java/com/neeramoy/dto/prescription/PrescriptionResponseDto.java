package com.neeramoy.dto.prescription;

import com.neeramoy.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponseDto {
    private String id;
    private String customerId;
    private String customerName;
    private String customerPhone;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private PrescriptionStatus status;
    private String rejectionReason;
    private String reviewerId;
    private String reviewerName;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
