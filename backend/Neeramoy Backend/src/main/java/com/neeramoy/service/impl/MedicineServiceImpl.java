package com.neeramoy.service.impl;

import com.neeramoy.model.Medicine;
import com.neeramoy.repository.MedicineRepository;
import com.neeramoy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineServiceImpl implements MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Page<Medicine> getMedicines(String keyword, String category, String type, String manufacturer, Double maxPrice, int page, int size, String sortBy) {
        
        Sort sort = Sort.by(Sort.Direction.DESC, "rating"); // default popularity sort
        if ("price-asc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price-desc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if ("rating".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Query query = new Query().with(pageable);
        List<Criteria> criteriaList = new ArrayList<>();

        if (keyword != null && !keyword.isEmpty()) {
            Criteria keywordCriteria = new Criteria().orOperator(
                Criteria.where("name").regex(keyword, "i"),
                Criteria.where("genericName").regex(keyword, "i"),
                Criteria.where("manufacturer").regex(keyword, "i"),
                Criteria.where("category").regex(keyword, "i"),
                Criteria.where("description").regex(keyword, "i"),
                Criteria.where("indications").regex(keyword, "i")
            );
            criteriaList.add(keywordCriteria);
        }

        if (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) {
            if ("special-offers".equalsIgnoreCase(category)) {
                criteriaList.add(Criteria.where("discount").gt(0));
            } else {
                List<String> mappedCategories = getMappedCategoryArray(category);
                criteriaList.add(Criteria.where("category").in(mappedCategories));
            }
        }

        if (type != null && !type.isEmpty() && !"all".equalsIgnoreCase(type)) {
            if ("otc".equalsIgnoreCase(type)) {
                criteriaList.add(Criteria.where("isOtc").is(true));
            } else if ("rx".equalsIgnoreCase(type)) {
                criteriaList.add(Criteria.where("isOtc").is(false));
            }
        }

        if (manufacturer != null && !manufacturer.isEmpty()) {
            criteriaList.add(Criteria.where("manufacturer").is(manufacturer));
        }

        if (maxPrice != null) {
            criteriaList.add(Criteria.where("price").lte(maxPrice));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        List<Medicine> medicines = mongoTemplate.find(query, Medicine.class);
        long count = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Medicine.class);
        
        return PageableExecutionUtils.getPage(medicines, pageable, () -> count);
    }

    private List<String> getMappedCategoryArray(String cat) {
        if (cat == null) return new ArrayList<>();
        // Match the frontend mapping logic from SearchResultsPage.jsx
        switch (cat.toLowerCase()) {
            case "medical-device":
            case "device":
                return List.of("devices");
            case "surgical-hygiene":
            case "home-care":
                return List.of("hygiene");
            case "supplement":
                return List.of("vitamins");
            case "fever":
                return List.of("fever", "pain");
            default:
                return List.of(cat);
        }
    }

    @Override
    public Medicine getMedicineById(String id) {
        return medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found with id: " + id));
    }

    @Override
    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @Override
    public Medicine updateMedicine(String id, Medicine medicine) {
        Medicine existing = getMedicineById(id);
        medicine.setId(existing.getId());
        return medicineRepository.save(medicine);
    }

    @Override
    public void deleteMedicine(String id) {
        medicineRepository.deleteById(id);
    }

    @Override
    public List<String> getCategories() {
        return mongoTemplate.query(Medicine.class)
                .distinct("category")
                .as(String.class)
                .all()
                .stream()
                .filter(c -> c != null && !c.isEmpty())
                .collect(Collectors.toList());
    }
}
