package com.neeramoy.controller.admin;

import com.neeramoy.exception.GlobalExceptionHandler;
import com.neeramoy.model.Medicine;
import com.neeramoy.service.MedicineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AdminMedicineControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MedicineService medicineService;

    @InjectMocks
    private AdminMedicineController adminMedicineController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminMedicineController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testCreateMedicine_Success() throws Exception {
        Medicine saved = Medicine.builder()
                .id("m1")
                .name("Napa")
                .price(10.0)
                .image("https://example.com/image.jpg")
                .build();

        when(medicineService.createMedicine(any(Medicine.class))).thenReturn(saved);

        mockMvc.perform(post("/api/admin/medicines")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Napa\",\"price\":10.0,\"image\":\"https://example.com/image.jpg\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("m1"))
                .andExpect(jsonPath("$.name").value("Napa"));
    }

    @Test
    void testCreateMedicine_NullPrice_ThrowsIllegalArgumentException_Returns400() throws Exception {
        when(medicineService.createMedicine(any(Medicine.class)))
                .thenThrow(new IllegalArgumentException("Price is required"));

        mockMvc.perform(post("/api/admin/medicines")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Napa\",\"price\":null}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Price is required"));
    }

    @Test
    void testCreateMedicine_NegativePrice_Returns400() throws Exception {
        when(medicineService.createMedicine(any(Medicine.class)))
                .thenThrow(new IllegalArgumentException("Price must be greater than zero"));

        mockMvc.perform(post("/api/admin/medicines")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Napa\",\"price\":-10.0}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Price must be greater than zero"));
    }

    @Test
    void testCreateMedicine_MalformedJson_Returns400() throws Exception {
        mockMvc.perform(post("/api/admin/medicines")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ invalid json }"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateMedicine_Success() throws Exception {
        Medicine updated = Medicine.builder()
                .id("m1")
                .name("Napa Extra")
                .price(15.0)
                .build();

        when(medicineService.updateMedicine(eq("m1"), any(Medicine.class))).thenReturn(updated);

        mockMvc.perform(put("/api/admin/medicines/m1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Napa Extra\",\"price\":15.0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Napa Extra"));
    }
}
