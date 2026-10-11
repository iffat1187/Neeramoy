package com.neeramoy.security;

import com.neeramoy.enums.Role;
import com.neeramoy.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private static final String TEST_SECRET = "8f7b764a781b0f55cf6fc393967d3e6962bb5f82c448bb0c00a68d06d48b1111";
    private static final long DEFAULT_EXPIRATION = 86400000L; // 24 hours

    private JwtUtils jwtUtils;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils(TEST_SECRET, DEFAULT_EXPIRATION);

        User user = User.builder()
                .id("u100")
                .email("patient@neeramoy.com")
                .fullName("Test Patient")
                .role(Role.CUSTOMER)
                .build();

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Test
    void generateJwtToken_generatesValidTokenWithCorrectSubject() {
        String token = jwtUtils.generateJwtToken(authentication);

        assertNotNull(token);
        assertEquals(3, token.split("\\.").length);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("patient@neeramoy.com", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void validateJwtToken_withExpiredToken_returnsFalse() throws InterruptedException {
        // Create JwtUtils with 1ms expiration
        JwtUtils expiringJwtUtils = new JwtUtils(TEST_SECRET, 1L);
        String token = expiringJwtUtils.generateJwtToken(authentication);

        // Wait 25ms so token definitely expires
        Thread.sleep(25);

        assertFalse(expiringJwtUtils.validateJwtToken(token), "Expired token must be rejected");
    }

    @Test
    void validateJwtToken_withNegativeExpiration_isImmediatelyExpired() {
        JwtUtils negativeExpUtils = new JwtUtils(TEST_SECRET, -1000L);
        String token = negativeExpUtils.generateJwtToken(authentication);

        assertFalse(negativeExpUtils.validateJwtToken(token), "Token generated with negative expiration must be expired");
    }

    @Test
    void validateJwtToken_withTamperedSignature_returnsFalse() {
        String token = jwtUtils.generateJwtToken(authentication);
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";

        assertFalse(jwtUtils.validateJwtToken(tamperedToken));
    }

    @Test
    void validateJwtToken_withMalformedToken_returnsFalse() {
        assertFalse(jwtUtils.validateJwtToken("not.a.valid.jwt.token"));
        assertFalse(jwtUtils.validateJwtToken("random-string"));
    }

    @Test
    void validateJwtToken_withEmptyOrNullToken_returnsFalse() {
        assertFalse(jwtUtils.validateJwtToken(""));
        assertFalse(jwtUtils.validateJwtToken(null));
    }

    @Test
    void configurableExpiration_supportsLongDurationWithoutOverflow() {
        // 30 days = 30 * 24 * 3600 * 1000 = 2,592,000,000 ms (> Integer.MAX_VALUE 2,147,483,647)
        long thirtyDaysMs = 2592000000L;
        JwtUtils longLivedJwtUtils = new JwtUtils(TEST_SECRET, thirtyDaysMs);

        assertEquals(thirtyDaysMs, longLivedJwtUtils.getJwtExpirationMs());

        String token = longLivedJwtUtils.generateJwtToken(authentication);
        assertTrue(longLivedJwtUtils.validateJwtToken(token));
        assertEquals("patient@neeramoy.com", longLivedJwtUtils.getUserNameFromJwtToken(token));
    }
}
