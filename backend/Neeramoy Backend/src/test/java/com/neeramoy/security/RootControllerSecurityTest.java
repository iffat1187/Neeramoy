package com.neeramoy.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class RootControllerSecurityTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void getRoot_isPubliclyAccessible() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("Neeramoy Backend API"));
    }

    @Test
    void getFavicon_isPubliclyAccessible() throws Exception {
        mockMvc.perform(get("/favicon.ico"))
                .andExpect(status().isNoContent());
    }

    @Test
    void postRoot_isForbiddenWithoutAuth() throws Exception {
        mockMvc.perform(post("/"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getProtectedOrders_withoutToken_isForbidden() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getProtectedAdmin_withoutToken_isForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/all"))
                .andExpect(status().isForbidden());
    }
}
