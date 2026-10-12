package com.neeramoy.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.neeramoy.dto.prescription.PrescriptionResponseDto;
import com.neeramoy.dto.prescription.PrescriptionReviewRequestDto;
import com.neeramoy.enums.PrescriptionStatus;
import com.neeramoy.model.Prescription;
import com.neeramoy.model.User;
import com.neeramoy.repository.PrescriptionRepository;
import com.neeramoy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PrescriptionServiceImplTest {

    @Mock
    private PrescriptionRepository prescriptionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @InjectMocks
    private PrescriptionServiceImpl prescriptionService;

    // Helper bytes for valid magic headers
    private static final byte[] VALID_JPEG_BYTES = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10};
    private static final byte[] VALID_PNG_BYTES = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00};
    private static final byte[] VALID_PDF_BYTES = "%PDF-1.4 header and content".getBytes();

    @BeforeEach
    void setUp() {
        lenient().when(cloudinary.uploader()).thenReturn(uploader);
    }

    @Test
    void uploadPrescription_validJpeg_successAndInitialPendingStatus() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", "rx.jpg", "image/jpeg", VALID_JPEG_BYTES
        );

        User customer = User.builder()
                .id("cust1")
                .fullName("John Doe")
                .phone("01711112222")
                .build();
        when(userRepository.findById("cust1")).thenReturn(Optional.of(customer));

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "https://res.cloudinary.com/test/rx.jpg");
        uploadResult.put("public_id", "neeramoy/prescriptions/rx123");
        uploadResult.put("resource_type", "image");
        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(uploadResult);

        when(prescriptionRepository.save(any(Prescription.class))).thenAnswer(inv -> {
            Prescription p = inv.getArgument(0);
            p.setId("rx-mongo-1");
            return p;
        });

        PrescriptionResponseDto response = prescriptionService.uploadPrescription(file, "cust1");

        assertNotNull(response);
        assertEquals("rx-mongo-1", response.getId());
        assertEquals("cust1", response.getCustomerId());
        assertEquals("John Doe", response.getCustomerName());
        assertEquals("01711112222", response.getCustomerPhone());
        assertEquals(PrescriptionStatus.PENDING, response.getStatus()); // Must be PENDING initially
        assertEquals("image/jpeg", response.getFileType());
        assertEquals("https://res.cloudinary.com/test/rx.jpg", response.getFileUrl());
        verify(uploader, times(1)).upload(any(byte[].class), anyMap());
        verify(prescriptionRepository, times(1)).save(any(Prescription.class));
    }

    @Test
    void uploadPrescription_validPdf_success() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", "report.pdf", "application/pdf", VALID_PDF_BYTES
        );

        when(userRepository.findById("cust2")).thenReturn(Optional.empty());

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "https://res.cloudinary.com/test/report.pdf");
        uploadResult.put("public_id", "neeramoy/prescriptions/pdf123");
        uploadResult.put("resource_type", "raw");
        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(uploadResult);

        when(prescriptionRepository.save(any(Prescription.class))).thenAnswer(inv -> {
            Prescription p = inv.getArgument(0);
            p.setId("rx-mongo-2");
            return p;
        });

        PrescriptionResponseDto response = prescriptionService.uploadPrescription(file, "cust2");

        assertNotNull(response);
        assertEquals(PrescriptionStatus.PENDING, response.getStatus());
        assertEquals("application/pdf", response.getFileType());
    }

    @Test
    void uploadPrescription_emptyFile_throwsIllegalArgumentException() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.jpg", "image/jpeg", new byte[0]);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                prescriptionService.uploadPrescription(emptyFile, "cust1")
        );
        assertTrue(ex.getMessage().contains("empty"));
    }

    @Test
    void uploadPrescription_exceeds5Mb_throwsIllegalArgumentException() {
        byte[] largeBytes = new byte[5 * 1024 * 1024 + 1];
        System.arraycopy(VALID_JPEG_BYTES, 0, largeBytes, 0, VALID_JPEG_BYTES.length);
        MockMultipartFile largeFile = new MockMultipartFile("file", "large.jpg", "image/jpeg", largeBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                prescriptionService.uploadPrescription(largeFile, "cust1")
        );
        assertTrue(ex.getMessage().contains("5MB"));
    }

    @Test
    void uploadPrescription_invalidFileType_throwsIllegalArgumentException() {
        byte[] exeBytes = "MZ not a prescription".getBytes();
        MockMultipartFile invalidFile = new MockMultipartFile("file", "fake.jpg", "image/jpeg", exeBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                prescriptionService.uploadPrescription(invalidFile, "cust1")
        );
        assertTrue(ex.getMessage().contains("Invalid file format"));
    }

    @Test
    void uploadPrescription_cloudinaryThrowsException_propagatesIOException() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", "rx.png", "image/png", VALID_PNG_BYTES
        );

        when(uploader.upload(any(byte[].class), anyMap())).thenThrow(new IOException("Cloudinary network timeout"));

        assertThrows(IOException.class, () -> prescriptionService.uploadPrescription(file, "cust1"));
        verify(prescriptionRepository, never()).save(any(Prescription.class));
    }

    @Test
    void getCustomerPrescriptions_returnsOnlyCustomerList() {
        Prescription p1 = Prescription.builder().id("p1").customerId("cust1").status(PrescriptionStatus.PENDING).build();
        Prescription p2 = Prescription.builder().id("p2").customerId("cust1").status(PrescriptionStatus.APPROVED).build();
        when(prescriptionRepository.findByCustomerIdOrderByCreatedAtDesc("cust1")).thenReturn(List.of(p1, p2));

        List<PrescriptionResponseDto> list = prescriptionService.getCustomerPrescriptions("cust1");

        assertEquals(2, list.size());
        assertEquals("p1", list.get(0).getId());
        assertEquals("p2", list.get(1).getId());
    }

    @Test
    void getPrescriptionById_ownerAccess_success() {
        Prescription p = Prescription.builder()
                .id("p1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        PrescriptionResponseDto res = prescriptionService.getPrescriptionById("p1", "cust1", false);
        assertNotNull(res);
        assertEquals("p1", res.getId());
    }

    @Test
    void getPrescriptionById_adminAccessOtherCustomer_success() {
        Prescription p = Prescription.builder()
                .id("p1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        PrescriptionResponseDto res = prescriptionService.getPrescriptionById("p1", "admin99", true);
        assertNotNull(res);
        assertEquals("p1", res.getId());
    }

    @Test
    void getPrescriptionById_unauthorizedCrossCustomerAccess_throwsAccessDeniedException() {
        Prescription p = Prescription.builder()
                .id("p1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        assertThrows(AccessDeniedException.class, () ->
                prescriptionService.getPrescriptionById("p1", "otherCustomer", false)
        );
    }

    @Test
    void getPrescriptionById_notFound_throwsIllegalArgumentException() {
        when(prescriptionRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                prescriptionService.getPrescriptionById("nonexistent", "cust1", false)
        );
    }

    @Test
    void deletePrescription_ownerPending_success() throws IOException {
        Prescription p = Prescription.builder()
                .id("p1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .filePublicId("neeramoy/prescriptions/sample")
                .resourceType("image")
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        prescriptionService.deletePrescription("p1", "cust1", false);

        verify(uploader, times(1)).destroy(eq("neeramoy/prescriptions/sample"), anyMap());
        verify(prescriptionRepository, times(1)).delete(p);
    }

    @Test
    void deletePrescription_unauthorizedCrossCustomer_throwsAccessDeniedException() {
        Prescription p = Prescription.builder()
                .id("p1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        assertThrows(AccessDeniedException.class, () ->
                prescriptionService.deletePrescription("p1", "attackerCust", false)
        );
        verify(prescriptionRepository, never()).delete(any());
    }

    @Test
    void deletePrescription_approvedPrescriptionByCustomer_throwsIllegalStateException() {
        Prescription p = Prescription.builder()
                .id("p1")
                .customerId("cust1")
                .status(PrescriptionStatus.APPROVED)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                prescriptionService.deletePrescription("p1", "cust1", false)
        );
        assertTrue(ex.getMessage().contains("already approved"));
        verify(prescriptionRepository, never()).delete(any());
    }

    @Test
    void deletePrescription_cloudinaryDestroyFails_stillDeletesFromDb() throws IOException {
        Prescription p = Prescription.builder()
                .id("p1")
                .customerId("cust1")
                .status(PrescriptionStatus.PENDING)
                .filePublicId("neeramoy/prescriptions/sample")
                .resourceType("image")
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));
        when(uploader.destroy(any(), anyMap())).thenThrow(new RuntimeException("Cloudinary destroy failed"));

        prescriptionService.deletePrescription("p1", "cust1", false);

        verify(prescriptionRepository, times(1)).delete(p);
    }

    @Test
    void getAllPrescriptionsAdmin_filtersCorrectly() {
        Prescription p1 = Prescription.builder().id("p1").status(PrescriptionStatus.PENDING).build();
        Prescription p2 = Prescription.builder().id("p2").status(PrescriptionStatus.APPROVED).build();

        when(prescriptionRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(p1, p2));
        when(prescriptionRepository.findByStatusOrderByCreatedAtDesc(PrescriptionStatus.PENDING)).thenReturn(List.of(p1));

        List<PrescriptionResponseDto> all = prescriptionService.getAllPrescriptionsAdmin(null);
        assertEquals(2, all.size());

        List<PrescriptionResponseDto> pending = prescriptionService.getAllPrescriptionsAdmin(PrescriptionStatus.PENDING);
        assertEquals(1, pending.size());
        assertEquals("p1", pending.get(0).getId());
    }

    @Test
    void reviewPrescription_approvePending_success() {
        Prescription p = Prescription.builder()
                .id("p1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));
        when(prescriptionRepository.save(any(Prescription.class))).thenAnswer(inv -> inv.getArgument(0));

        PrescriptionReviewRequestDto req = PrescriptionReviewRequestDto.builder()
                .status(PrescriptionStatus.APPROVED)
                .build();

        PrescriptionResponseDto res = prescriptionService.reviewPrescription("p1", req, "admin1", "Dr. Pharmacist");

        assertEquals(PrescriptionStatus.APPROVED, res.getStatus());
        assertEquals("admin1", res.getReviewerId());
        assertEquals("Dr. Pharmacist", res.getReviewerName());
        assertNotNull(res.getReviewedAt());
        assertNull(res.getRejectionReason());
    }

    @Test
    void reviewPrescription_rejectPendingWithReason_success() {
        Prescription p = Prescription.builder()
                .id("p1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));
        when(prescriptionRepository.save(any(Prescription.class))).thenAnswer(inv -> inv.getArgument(0));

        PrescriptionReviewRequestDto req = PrescriptionReviewRequestDto.builder()
                .status(PrescriptionStatus.REJECTED)
                .rejectionReason("Doctor seal not clearly visible")
                .build();

        PrescriptionResponseDto res = prescriptionService.reviewPrescription("p1", req, "admin1", "Dr. Pharmacist");

        assertEquals(PrescriptionStatus.REJECTED, res.getStatus());
        assertEquals("Doctor seal not clearly visible", res.getRejectionReason());
    }

    @Test
    void reviewPrescription_rejectWithoutReason_throwsIllegalArgumentException() {
        Prescription p = Prescription.builder()
                .id("p1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        PrescriptionReviewRequestDto req = PrescriptionReviewRequestDto.builder()
                .status(PrescriptionStatus.REJECTED)
                .rejectionReason("   ")
                .build();

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                prescriptionService.reviewPrescription("p1", req, "admin1", "Dr. Pharmacist")
        );
        assertTrue(ex.getMessage().contains("Rejection reason is required"));
    }

    @Test
    void reviewPrescription_alreadyReviewed_throwsIllegalStateException() {
        Prescription p = Prescription.builder()
                .id("p1")
                .status(PrescriptionStatus.APPROVED)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        PrescriptionReviewRequestDto req = PrescriptionReviewRequestDto.builder()
                .status(PrescriptionStatus.REJECTED)
                .rejectionReason("Duplicate")
                .build();

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                prescriptionService.reviewPrescription("p1", req, "admin1", "Dr. Pharmacist")
        );
        assertTrue(ex.getMessage().contains("already been reviewed"));
    }

    @Test
    void reviewPrescription_targetStatusPending_throwsIllegalArgumentException() {
        Prescription p = Prescription.builder()
                .id("p1")
                .status(PrescriptionStatus.PENDING)
                .build();
        when(prescriptionRepository.findById("p1")).thenReturn(Optional.of(p));

        PrescriptionReviewRequestDto req = PrescriptionReviewRequestDto.builder()
                .status(PrescriptionStatus.PENDING)
                .build();

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                prescriptionService.reviewPrescription("p1", req, "admin1", "Dr. Pharmacist")
        );
        assertTrue(ex.getMessage().contains("Cannot transition a prescription back to PENDING"));
    }
}
