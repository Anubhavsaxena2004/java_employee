package com.complaint.system.controller;

import com.complaint.system.dto.AdminDecisionDTO;
import com.complaint.system.dto.ComplaintRequestDTO;
import com.complaint.system.dto.ComplaintResponseDTO;
import com.complaint.system.model.ComplaintStatus;
import com.complaint.system.service.ComplaintService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ComplaintController.class)
class ComplaintControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ComplaintService complaintService;

    @Test
    @DisplayName("POST /api/complaints should submit a valid complaint and return HTTP 201 Created")
    void testSubmitValidComplaint() throws Exception {
        ComplaintRequestDTO requestDTO = ComplaintRequestDTO.builder()
                .studentId("STU001")
                .title("Lab Monitor Glitch")
                .description("Monitor 14 in Lab 2 flickers constantly.")
                .category("INFRASTRUCTURE")
                .build();

        ComplaintResponseDTO responseDTO = ComplaintResponseDTO.builder()
                .id(1L)
                .studentId("STU001")
                .studentName("Alice Smith")
                .title("Lab Monitor Glitch")
                .description("Monitor 14 in Lab 2 flickers constantly.")
                .category("INFRASTRUCTURE")
                .status(ComplaintStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        given(complaintService.createComplaint(any(ComplaintRequestDTO.class))).willReturn(responseDTO);

        mockMvc.perform(post("/api/complaints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.studentId").value("STU001"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("PATCH /api/complaints/{id}/status should update status from PENDING to APPROVED and return HTTP 200 OK")
    void testUpdateStatusToApproved() throws Exception {
        AdminDecisionDTO decisionDTO = AdminDecisionDTO.builder()
                .status(ComplaintStatus.APPROVED)
                .adminRemark("Replacement monitor scheduled for Lab 2.")
                .build();

        ComplaintResponseDTO responseDTO = ComplaintResponseDTO.builder()
                .id(1L)
                .studentId("STU001")
                .studentName("Alice Smith")
                .title("Lab Monitor Glitch")
                .description("Monitor 14 in Lab 2 flickers constantly.")
                .category("INFRASTRUCTURE")
                .status(ComplaintStatus.APPROVED)
                .adminRemark("Replacement monitor scheduled for Lab 2.")
                .createdAt(LocalDateTime.now())
                .build();

        given(complaintService.updateComplaintStatus(eq(1L), any(AdminDecisionDTO.class))).willReturn(responseDTO);

        mockMvc.perform(patch("/api/complaints/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(decisionDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.adminRemark").value("Replacement monitor scheduled for Lab 2."));
    }

    @Test
    @DisplayName("GET /api/complaints/student/{studentId} should return student complaints with HTTP 200 OK")
    void testGetComplaintsByStudent() throws Exception {
        ComplaintResponseDTO responseDTO = ComplaintResponseDTO.builder()
                .id(1L)
                .studentId("STU001")
                .studentName("Alice Smith")
                .title("Lab Monitor Glitch")
                .description("Monitor 14 in Lab 2 flickers constantly.")
                .category("INFRASTRUCTURE")
                .status(ComplaintStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        given(complaintService.getComplaintsByStudent("STU001")).willReturn(List.of(responseDTO));

        mockMvc.perform(get("/api/complaints/student/STU001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId").value("STU001"))
                .andExpect(jsonPath("$[0].title").value("Lab Monitor Glitch"));
    }
}
