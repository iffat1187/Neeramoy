package com.neeramoy.config;

import com.neeramoy.enums.Role;
import com.neeramoy.model.User;
import com.neeramoy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminUserSeederTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminUserSeeder adminUserSeeder;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", false);
        ReflectionTestUtils.setField(adminUserSeeder, "adminEmail", "admin@neeramoy.local");
        ReflectionTestUtils.setField(adminUserSeeder, "adminPassword", "secret123");
        ReflectionTestUtils.setField(adminUserSeeder, "adminName", "Local Admin");
        ReflectionTestUtils.setField(adminUserSeeder, "adminPhone", "01700000000");
    }

    @Test
    void testAdminProvisioningDisabled_DoesNothing() throws Exception {
        adminUserSeeder.run();

        verify(userRepository, never()).findByEmail(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testAdminProvisioningEnabled_MissingEmail_DoesNothing() throws Exception {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", true);
        ReflectionTestUtils.setField(adminUserSeeder, "adminEmail", "");

        adminUserSeeder.run();

        verify(userRepository, never()).findByEmail(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testAdminProvisioningEnabled_MissingPassword_DoesNothing() throws Exception {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", true);
        ReflectionTestUtils.setField(adminUserSeeder, "adminPassword", "   ");

        adminUserSeeder.run();

        verify(userRepository, never()).findByEmail(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testAdminProvisioningEnabled_AdminAlreadyExists_MatchingPassword_DoesNotDuplicate() throws Exception {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", true);

        User existingAdmin = User.builder()
                .id("admin-1")
                .email("admin@neeramoy.local")
                .password("encodedSecret123")
                .role(Role.ADMIN)
                .build();
        when(userRepository.findByEmail("admin@neeramoy.local")).thenReturn(Optional.of(existingAdmin));
        when(passwordEncoder.matches("secret123", "encodedSecret123")).thenReturn(true);

        adminUserSeeder.run();

        verify(userRepository, times(1)).findByEmail("admin@neeramoy.local");
        verify(userRepository, never()).save(any());
    }

    @Test
    void testAdminProvisioningEnabled_AdminAlreadyExists_MismatchedPassword_UpdatesCredentials() throws Exception {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", true);

        User existingAdmin = User.builder()
                .id("admin-1")
                .email("admin@neeramoy.local")
                .password("oldEncoded")
                .role(Role.ADMIN)
                .build();
        when(userRepository.findByEmail("admin@neeramoy.local")).thenReturn(Optional.of(existingAdmin));
        when(passwordEncoder.matches("secret123", "oldEncoded")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("newEncoded");

        adminUserSeeder.run();

        verify(userRepository, times(1)).findByEmail("admin@neeramoy.local");
        verify(userRepository, times(1)).save(existingAdmin);
        assertEquals("newEncoded", existingAdmin.getPassword());
    }

    @Test
    void testAdminProvisioningEnabled_ExistingUserHasCustomerRole_DoesNotModifyRole() throws Exception {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", true);

        User existingCustomer = User.builder()
                .id("cust-1")
                .email("admin@neeramoy.local")
                .role(Role.CUSTOMER)
                .build();
        when(userRepository.findByEmail("admin@neeramoy.local")).thenReturn(Optional.of(existingCustomer));

        adminUserSeeder.run();

        verify(userRepository, times(1)).findByEmail("admin@neeramoy.local");
        verify(userRepository, never()).save(any());
    }

    @Test
    void testAdminProvisioningEnabled_PhoneInUseByAnotherUser_DoesNotSave() throws Exception {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", true);

        when(userRepository.findByEmail("admin@neeramoy.local")).thenReturn(Optional.empty());
        User existingUserWithPhone = User.builder()
                .id("other-user")
                .phone("01700000000")
                .role(Role.CUSTOMER)
                .build();
        when(userRepository.findByPhone("01700000000")).thenReturn(Optional.of(existingUserWithPhone));

        adminUserSeeder.run();

        verify(userRepository, times(1)).findByEmail("admin@neeramoy.local");
        verify(userRepository, times(1)).findByPhone("01700000000");
        verify(userRepository, never()).save(any());
    }

    @Test
    void testAdminProvisioningEnabled_SuccessfulProvisioning() throws Exception {
        ReflectionTestUtils.setField(adminUserSeeder, "adminProvisionEnabled", true);

        when(userRepository.findByEmail("admin@neeramoy.local")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("01700000000")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("encodedSecret123");

        adminUserSeeder.run();

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("admin@neeramoy.local", savedUser.getEmail());
        assertEquals("01700000000", savedUser.getPhone());
        assertEquals("Local Admin", savedUser.getFullName());
        assertEquals("encodedSecret123", savedUser.getPassword());
        assertEquals(Role.ADMIN, savedUser.getRole());
    }
}
