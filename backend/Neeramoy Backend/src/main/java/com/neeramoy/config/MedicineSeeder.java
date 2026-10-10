package com.neeramoy.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.neeramoy.model.Medicine;
import com.neeramoy.repository.MedicineRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class MedicineSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MedicineSeeder.class);

    @Value("${app.seed.medicines.enabled:false}")
    private boolean seedEnabled;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ResourceLoader resourceLoader;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            logger.info("Medicine seeder is disabled. Set app.seed.medicines.enabled=true to enable.");
            return;
        }

        try {
            long count = medicineRepository.count();
            if (count > 0) {
                logger.info("Medicine collection is not empty ({} records found). Seeding skipped.", count);
                return;
            }

            logger.info("Medicine collection is empty. Starting seed process...");
            Resource resource = resourceLoader.getResource("classpath:medicines.json");
            
            if (!resource.exists()) {
                logger.error("Seeding failed: medicines.json not found in classpath.");
                return;
            }

            try (InputStream inputStream = resource.getInputStream()) {
                List<Medicine> medicines = objectMapper.readValue(inputStream, new TypeReference<List<Medicine>>() {});
                
                if (medicines == null || medicines.isEmpty()) {
                    logger.error("Seeding failed: medicines.json contains no valid records.");
                    return;
                }

                medicineRepository.saveAll(medicines);
                logger.info("Successfully seeded {} medicine records.", medicines.size());
            }
        } catch (Exception e) {
            logger.error("Seeding failed due to an error: {}", e.getMessage(), e);
            throw e; // Fail clearly as required
        }
    }
}
