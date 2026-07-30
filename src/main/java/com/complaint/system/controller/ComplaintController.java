package com.complaint.system.controller;

import com.complaint.system.dto.AdminDecisionDTO;
import com.complaint.system.dto.ComplaintRequestDTO;
import com.complaint.system.dto.ComplaintResponseDTO;
import com.complaint.system.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ComplaintResponseDTO> createComplaint(@Valid @RequestBody ComplaintRequestDTO requestDTO) {
        ComplaintResponseDTO response = complaintService.createComplaint(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponseDTO>> getAllComplaints() {
        List<ComplaintResponseDTO> responseList = complaintService.getAllComplaints();
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ComplaintResponseDTO>> getComplaintsByStudent(@PathVariable String studentId) {
        List<ComplaintResponseDTO> responseList = complaintService.getComplaintsByStudent(studentId);
        return ResponseEntity.ok(responseList);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ComplaintResponseDTO> updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminDecisionDTO decisionDTO) {
        ComplaintResponseDTO updated = complaintService.updateComplaintStatus(id, decisionDTO);
        return ResponseEntity.ok(updated);
    }
}
