package com.neeramoy.controller.api;

import com.neeramoy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(medicineService.getCategories());
    }
}
