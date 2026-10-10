package com.neeramoy.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.neeramoy.model.Medicine;
import com.neeramoy.repository.MedicineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MedicineSeederTest {

    @Mock
    private MedicineRepository medicineRepository;

    @Mock
    private ResourceLoader resourceLoader;

    @Mock
    private Resource resource;

    @InjectMocks
    private MedicineSeeder medicineSeeder;

    @BeforeEach
    void setUp() {
        // Default to disabled
        ReflectionTestUtils.setField(medicineSeeder, "seedEnabled", false);
    }

    @Test
    void testSeedingDisabled_NoRecordsInserted() throws Exception {
        medicineSeeder.run();
        
        verify(medicineRepository, never()).count();
        verify(medicineRepository, never()).saveAll(any());
    }

    @Test
    void testCollectionAlreadyContainsRecords_SeedingSkipped() throws Exception {
        ReflectionTestUtils.setField(medicineSeeder, "seedEnabled", true);
        when(medicineRepository.count()).thenReturn(5L);

        medicineSeeder.run();

        verify(medicineRepository, times(1)).count();
        verify(resourceLoader, never()).getResource(anyString());
        verify(medicineRepository, never()).saveAll(any());
    }

    @Test
    void testSeedingEnabledEmptyCollection_RecordsInserted() throws Exception {
        ReflectionTestUtils.setField(medicineSeeder, "seedEnabled", true);
        when(medicineRepository.count()).thenReturn(0L);
        when(resourceLoader.getResource("classpath:medicines.json")).thenReturn(resource);
        when(resource.exists()).thenReturn(true);
        
        InputStream is = new ByteArrayInputStream("[{\"name\":\"Napa\"}]".getBytes());
        when(resource.getInputStream()).thenReturn(is);

        medicineSeeder.run();

        verify(medicineRepository, times(1)).saveAll(any());
    }

    @Test
    void testInvalidJson_FailureHandled() throws Exception {
        ReflectionTestUtils.setField(medicineSeeder, "seedEnabled", true);
        when(medicineRepository.count()).thenReturn(0L);
        when(resourceLoader.getResource("classpath:medicines.json")).thenReturn(resource);
        when(resource.exists()).thenReturn(true);
        
        InputStream is = new ByteArrayInputStream("invalid json".getBytes());
        when(resource.getInputStream()).thenReturn(is);

        assertThrows(Exception.class, () -> medicineSeeder.run());
        verify(medicineRepository, never()).saveAll(any());
    }

    @Test
    void testResourceNotFound_FailureHandled() throws Exception {
        ReflectionTestUtils.setField(medicineSeeder, "seedEnabled", true);
        when(medicineRepository.count()).thenReturn(0L);
        when(resourceLoader.getResource("classpath:medicines.json")).thenReturn(resource);
        when(resource.exists()).thenReturn(false);

        medicineSeeder.run();

        verify(medicineRepository, never()).saveAll(any());
    }
}
