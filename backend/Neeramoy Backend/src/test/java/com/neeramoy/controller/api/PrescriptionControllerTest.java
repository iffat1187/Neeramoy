package com.neeramoy.controller.api;

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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class PrescriptionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PrescriptionService prescriptionService;

    @InjectMocks
    private PrescriptionController prescriptionController;

    private User customerUser;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(prescriptionController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        customerUser = User.builder()
                .id("cust1")
                .fullName("Rahim Uddin")
                .phone("01712345678")
                .role(Role.CUSTOMER)
                .build();

        userDetails = UserDetailsImpl.build(customerUser);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void uploadPrescription_success_returnsCreated() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "rx.jpg", "image/jpeg", new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF}
        );

        PrescriptionResponseDto responseDto = PrescriptionResponseDto.builder()
                .id("rx1")
                .customerId("cust1")
                .customerName("Rahim Uddin")
                .status(PrescriptionStatus.PENDING)
                .fileUrl("https://cloudinary.com/rx1.jpg")
                .build();

        when(prescriptionService.uploadPrescription(any(), eq("cust1"))).thenReturn(responseDto);

        mockMvc.perform(multipart("/api/prescriptions").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("rx1"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.customerName").value("Rahim Uddin"));
    }

    @Test
    void getMyPrescriptions_returnsList() throws Exception {
        PrescriptionResponseDto dto = PrescriptionResponseDto.builder()
                .id("rx1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .build();

        when(prescriptionService.getCustomerPrescriptions("cust1")).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/prescriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value("rx1"));
    }

    @Test
    void getPrescriptionById_owner_returnsOk() throws Exception {
        PrescriptionResponseDto dto = PrescriptionResponseDto.builder()
                .id("rx1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .build();

        when(prescriptionService.getPrescriptionById("rx1", "cust1", false)).thenReturn(dto);

        mockMvc.perform(get("/api/prescriptions/rx1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("rx1"));
    }

    @Test
    void getPrescriptionById_unauthorizedCrossCustomer_returns403Forbidden() throws Exception {
        when(prescriptionService.getPrescriptionById("rx99", "cust1", false))
                .thenThrow(new AccessDeniedException("You are not authorized to access this prescription."));

        mockMvc.perform(get("/api/prescriptions/rx99"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("You are not authorized to access this prescription."));
    }

    @Test
    void deletePrescription_success_returnsOk() throws Exception {
        mockMvc.perform(delete("/api/prescriptions/rx1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Prescription deleted successfully."));
    }

    @Test
    void deletePrescription_unauthorized_returns403Forbidden() throws Exception {
        doThrow(new AccessDeniedException("You are not authorized to delete this prescription."))
                .when(prescriptionService).deletePrescription("rx1", "cust1", false);

        mockMvc.perform(delete("/api/prescriptions/rx1"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("You are not authorized to delete this prescription."));
    }
}
