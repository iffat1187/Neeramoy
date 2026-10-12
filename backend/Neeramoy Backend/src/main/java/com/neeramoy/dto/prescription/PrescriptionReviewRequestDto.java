package com.neeramoy.dto.prescription;

import com.neeramoy.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionReviewRequestDto {
    private PrescriptionStatus status;
    private String rejectionReason;
}
