package com.neeramoy.repository;

import com.neeramoy.model.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {
    
    // Support for filtering by keyword across multiple fields
    @Query("{ '$or': [ " +
            "{ 'name': { $regex: ?0, $options: 'i' } }, " +
            "{ 'genericName': { $regex: ?0, $options: 'i' } }, " +
            "{ 'manufacturer': { $regex: ?0, $options: 'i' } }, " +
            "{ 'category': { $regex: ?0, $options: 'i' } }, " +
            "{ 'description': { $regex: ?0, $options: 'i' } }, " +
            "{ 'indications': { $regex: ?0, $options: 'i' } } " +
            "] }")
    Page<Medicine> searchByKeyword(String keyword, Pageable pageable);

    Page<Medicine> findByCategory(String category, Pageable pageable);
}
