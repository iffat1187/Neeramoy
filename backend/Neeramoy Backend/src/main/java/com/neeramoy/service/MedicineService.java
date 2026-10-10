package com.neeramoy.service;

import com.neeramoy.model.Medicine;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MedicineService {
    Page<Medicine> getMedicines(String keyword, String category, String type, String manufacturer, Double maxPrice, int page, int size, String sortBy);
    Medicine getMedicineById(String id);
    Medicine createMedicine(Medicine medicine);
    Medicine updateMedicine(String id, Medicine medicine);
    void deleteMedicine(String id);
    List<String> getCategories();
}
