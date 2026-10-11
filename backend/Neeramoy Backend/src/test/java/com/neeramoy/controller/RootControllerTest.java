package com.neeramoy.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class RootControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new RootController()).build();
    }

    @Test
    void root_returnsServiceStatusMessage() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.service").value("Neeramoy Backend API"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void favicon_returnsNoContent() throws Exception {
        mockMvc.perform(get("/favicon.ico"))
                .andExpect(status().isNoContent());
    }
}
