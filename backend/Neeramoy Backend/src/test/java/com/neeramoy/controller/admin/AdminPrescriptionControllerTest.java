package com.neeramoy.controller.admin;

import com.neeramoy.dto.prescription.PrescriptionResponseDto;
import com.neeramoy.enums.PrescriptionStatus;
import com.neeramoy.enums.Role;
import com.neeramoy.exception.GlobalExceptionHandler;
import com.neeramoy.model.User;
import com.neeramoy.security.UserDetailsImpl;
import com.neeramoy.service.PrescriptionService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AdminPrescriptionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PrescriptionService prescriptionService;

    @InjectMocks
    private AdminPrescriptionController adminPrescriptionController;

    private User adminUser;
    private UserDetailsImpl adminDetails;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminPrescriptionController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        adminUser = User.builder()
                .id("admin1")
                .fullName("Dr. Admin")
                .phone("01800000000")
                .role(Role.ADMIN)
                .build();

        adminDetails = UserDetailsImpl.build(adminUser);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(adminDetails, null, adminDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getAllPrescriptions_returnsList() throws Exception {
        PrescriptionResponseDto dto = PrescriptionResponseDto.builder()
                .id("rx1")
                .status(PrescriptionStatus.PENDING)
                .build();

        when(prescriptionService.getAllPrescriptionsAdmin(null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/admin/prescriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value("rx1"));
    }

    @Test
    void getAllPrescriptions_withStatusFilter_passesStatus() throws Exception {
        PrescriptionResponseDto dto = PrescriptionResponseDto.builder()
                .id("rx2")
                .status(PrescriptionStatus.PENDING)
                .build();

        when(prescriptionService.getAllPrescriptionsAdmin(PrescriptionStatus.PENDING)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/admin/prescriptions").param("status", "PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("rx2"));
    }

    @Test
    void getPrescriptionById_admin_returnsPrescription() throws Exception {
        PrescriptionResponseDto dto = PrescriptionResponseDto.builder()
                .id("rx1")
                .status(PrescriptionStatus.PENDING)
                .build();

        when(prescriptionService.getPrescriptionById("rx1", "admin1", true)).thenReturn(dto);

        mockMvc.perform(get("/api/admin/prescriptions/rx1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("rx1"));
    }

    @Test
    void approvePrescription_success() throws Exception {
        PrescriptionResponseDto approved = PrescriptionResponseDto.builder()
                .id("rx1")
                .status(PrescriptionStatus.APPROVED)
                .reviewerId("admin1")
                .reviewerName("Dr. Admin")
                .build();

        when(prescriptionService.reviewPrescription(eq("rx1"), any(), eq("admin1"), eq("Dr. Admin")))
                .thenReturn(approved);

        mockMvc.perform(patch("/api/admin/prescriptions/rx1/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.reviewerName").value("Dr. Admin"));
    }

    @Test
    void rejectPrescription_withReason_success() throws Exception {
        PrescriptionResponseDto rejected = PrescriptionResponseDto.builder()
                .id("rx1")
                .status(PrescriptionStatus.REJECTED)
                .rejectionReason("Expired prescription date")
                .reviewerId("admin1")
                .reviewerName("Dr. Admin")
                .build();

        when(prescriptionService.reviewPrescription(eq("rx1"), any(), eq("admin1"), eq("Dr. Admin")))
                .thenReturn(rejected);

        mockMvc.perform(patch("/api/admin/prescriptions/rx1/reject")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rejectionReason\": \"Expired prescription date\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"))
                .andExpect(jsonPath("$.rejectionReason").value("Expired prescription date"));
    }

    @Test
    void rejectPrescription_missingReason_returns400BadRequest() throws Exception {
        when(prescriptionService.reviewPrescription(eq("rx1"), any(), eq("admin1"), eq("Dr. Admin")))
                .thenThrow(new IllegalArgumentException("Rejection reason is required when rejecting a prescription."));

        mockMvc.perform(patch("/api/admin/prescriptions/rx1/reject")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Rejection reason is required when rejecting a prescription."));
    }
}
