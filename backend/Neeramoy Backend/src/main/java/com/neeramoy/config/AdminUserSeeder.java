package com.neeramoy.config;

import com.neeramoy.enums.Role;
import com.neeramoy.model.User;
import com.neeramoy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminUserSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserSeeder.class);

    @Value("${app.dev.admin.enabled:${DEV_ADMIN_ENABLED:${ADMIN_SEED_ENABLED:false}}}")
    private boolean adminProvisionEnabled;

    @Value("${app.dev.admin.email:${DEV_ADMIN_EMAIL:${ADMIN_SEED_EMAIL:}}}")
    private String adminEmail;

    @Value("${app.dev.admin.password:${DEV_ADMIN_PASSWORD:${ADMIN_SEED_PASSWORD:}}}")
    private String adminPassword;

    @Value("${app.dev.admin.name:${DEV_ADMIN_NAME:${ADMIN_SEED_NAME:Admin User}}}")
    private String adminName;

    @Value("${app.dev.admin.phone:${DEV_ADMIN_PHONE:${ADMIN_SEED_PHONE:01700000000}}}")
    private String adminPhone;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!adminProvisionEnabled) {
            logger.info("Admin provisioning is disabled. Set app.dev.admin.enabled=true (or DEV_ADMIN_ENABLED=true) to enable.");
            return;
        }

        if (adminEmail == null || adminEmail.trim().isEmpty() || adminPassword == null || adminPassword.trim().isEmpty()) {
            logger.warn("Admin provisioning is enabled, but admin email or password is not configured. Skipping provisioning.");
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase();
        String normalizedPhone = (adminPhone != null && !adminPhone.trim().isEmpty()) ? adminPhone.trim() : "01700000000";

        Optional<User> existingUserByEmail = userRepository.findByEmail(normalizedEmail);
        if (existingUserByEmail.isPresent()) {
            User existing = existingUserByEmail.get();
            if (existing.getRole() == Role.ADMIN) {
                if (!passwordEncoder.matches(adminPassword.trim(), existing.getPassword())) {
                    existing.setPassword(passwordEncoder.encode(adminPassword.trim()));
                    userRepository.save(existing);
                    logger.info("Admin user credentials updated for email: {}", normalizedEmail);
                } else {
                    logger.info("Admin user already exists with matching credentials for email: {}. Skipping provisioning.", normalizedEmail);
                }
            } else {
                logger.warn("User already exists for email {} with role {}. Refusing to modify existing user.", normalizedEmail, existing.getRole());
            }
            return;
        }

        Optional<User> existingUserByPhone = userRepository.findByPhone(normalizedPhone);
        if (existingUserByPhone.isPresent()) {
            logger.warn("Cannot provision admin user: phone number {} is already in use by another account. Please configure a unique DEV_ADMIN_PHONE.", normalizedPhone);
            return;
        }

        User admin = User.builder()
                .fullName(adminName != null && !adminName.trim().isEmpty() ? adminName.trim() : "Admin User")
                .email(normalizedEmail)
                .phone(normalizedPhone)
                .password(passwordEncoder.encode(adminPassword.trim()))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        logger.info("Development admin account successfully provisioned for email: {}", normalizedEmail);
    }
}
