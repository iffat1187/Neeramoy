package com.neeramoy.model;

import com.neeramoy.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;

    private String customerId;
    private String customerName;
    private String customerPhone;

    private String fileUrl;
    private String filePublicId;
    private String fileName;
    private String fileType;
    private String resourceType;

    private PrescriptionStatus status;
    private String rejectionReason;

    private String reviewerId;
    private String reviewerName;
    private LocalDateTime reviewedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
