package com.neeramoy.service.impl;

import com.neeramoy.model.Medicine;
import com.neeramoy.repository.MedicineRepository;
import com.neeramoy.service.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MedicineServiceImplTest {

    @Mock
    private MedicineRepository medicineRepository;

    @Mock
    private ImageService imageService;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private MedicineServiceImpl medicineService;

    private Medicine testMedicine;

    @BeforeEach
    void setUp() {
        testMedicine = Medicine.builder()
                .id("med-123")
                .name("Paracetamol")
                .genericName("Acetaminophen")
                .manufacturer("Square Pharma")
                .price(25.0)
                .category("fever")
                .image("https://res.cloudinary.com/demo/image/upload/v1/test.png")
                .imageId("med-images/test")
                .build();
    }

    @Test
    void testCreateMedicine_SuccessWithDefaults() {
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Medicine result = medicineService.createMedicine(testMedicine);

        assertNotNull(result);
        assertEquals("Paracetamol", result.getName());
        assertEquals(25.0, result.getPrice());
        assertEquals(25.0, result.getOriginalPrice(), "originalPrice should default to price when null");
        assertEquals(0.0, result.getDiscount(), "discount should default to 0.0 when null");
        assertEquals(4.5, result.getRating(), "rating should default to 4.5 when null");
        assertTrue(result.isInStock(), "inStock should default to true when null");
        assertFalse(result.isOtc(), "isOtc should default to false when null");
        verify(medicineRepository, times(1)).save(testMedicine);
    }

    @Test
    void testCreateMedicine_MissingName_ThrowsException() {
        testMedicine.setName(null);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> medicineService.createMedicine(testMedicine));
        assertEquals("Medicine name is required", ex.getMessage());
        verify(medicineRepository, never()).save(any());
    }

    @Test
    void testCreateMedicine_MissingPrice_ThrowsException() {
        testMedicine.setPrice(null);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> medicineService.createMedicine(testMedicine));
        assertEquals("Price is required", ex.getMessage());
        verify(medicineRepository, never()).save(any());
    }

    @Test
    void testCreateMedicine_NonPositivePrice_ThrowsException() {
        testMedicine.setPrice(-5.0);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> medicineService.createMedicine(testMedicine));
        assertEquals("Price must be greater than zero", ex.getMessage());
        verify(medicineRepository, never()).save(any());
    }

    @Test
    void testUpdateMedicine_PreservesUnchangedFieldsAndDoesNotDeleteImageWhenNotReplaced() throws Exception {
        Medicine existing = Medicine.builder()
                .id("med-123")
                .name("Paracetamol 500mg")
                .genericName("Acetaminophen")
                .form("Tablet")
                .packSize("10")
                .price(20.0)
                .originalPrice(25.0)
                .discount(5.0)
                .rating(4.8)
                .image("https://res.cloudinary.com/demo/image/upload/v1/existing.png")
                .imageId("med-images/existing")
                .inStock(true)
                .build();

        when(medicineRepository.findById("med-123")).thenReturn(Optional.of(existing));
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Update with new price only
        Medicine updateDto = Medicine.builder()
                .price(30.0)
                .build();

        Medicine updated = medicineService.updateMedicine("med-123", updateDto);

        assertEquals(30.0, updated.getPrice());
        assertEquals("Paracetamol 500mg", updated.getName(), "Name should be preserved");
        assertEquals("Tablet", updated.getForm(), "Form should be preserved");
        assertEquals("10", updated.getPackSize(), "Pack size should be preserved");
        assertEquals(25.0, updated.getOriginalPrice(), "Original price should be preserved");
        assertEquals("med-images/existing", updated.getImageId(), "ImageId should be preserved");

        // Old image must NOT be deleted
        verify(imageService, never()).deleteImage(anyString());
    }

    @Test
    void testUpdateMedicine_DeletesOldImageWhenNewImageProvided() throws Exception {
        Medicine existing = Medicine.builder()
                .id("med-123")
                .name("Paracetamol")
                .price(20.0)
                .image("https://res.cloudinary.com/demo/image/upload/v1/old.png")
                .imageId("med-images/old")
                .build();

        when(medicineRepository.findById("med-123")).thenReturn(Optional.of(existing));
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Medicine updateDto = Medicine.builder()
                .name("Paracetamol")
                .price(22.0)
                .image("https://res.cloudinary.com/demo/image/upload/v1/new.png")
                .imageId("med-images/new")
                .build();

        Medicine updated = medicineService.updateMedicine("med-123", updateDto);

        assertEquals("med-images/new", updated.getImageId());
        verify(imageService, times(1)).deleteImage("med-images/old");
    }
}
