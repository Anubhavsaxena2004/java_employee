package com.complaint.system.service;

import com.complaint.system.dto.AdminDecisionDTO;
import com.complaint.system.dto.ComplaintRequestDTO;
import com.complaint.system.dto.ComplaintResponseDTO;

import java.util.List;

public interface ComplaintService {
    ComplaintResponseDTO createComplaint(ComplaintRequestDTO requestDTO);
    List<ComplaintResponseDTO> getAllComplaints();
    List<ComplaintResponseDTO> getComplaintsByStudent(String studentId);
    ComplaintResponseDTO updateComplaintStatus(Long complaintId, AdminDecisionDTO decisionDTO);
}
