package com.neeramoy.repository;

import com.neeramoy.enums.PrescriptionStatus;
import com.neeramoy.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    List<Prescription> findByCustomerIdOrderByCreatedAtDesc(String customerId);
    List<Prescription> findAllByOrderByCreatedAtDesc();
    List<Prescription> findByStatusOrderByCreatedAtDesc(PrescriptionStatus status);
}
