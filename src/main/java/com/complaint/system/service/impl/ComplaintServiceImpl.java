package com.complaint.system.service.impl;

import com.complaint.system.dto.AdminDecisionDTO;
import com.complaint.system.dto.ComplaintRequestDTO;
import com.complaint.system.dto.ComplaintResponseDTO;
import com.complaint.system.model.Complaint;
import com.complaint.system.model.ComplaintStatus;
import com.complaint.system.model.Student;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.repository.StudentRepository;
import com.complaint.system.service.ComplaintService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final StudentRepository studentRepository;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository, StudentRepository studentRepository) {
        this.complaintRepository = complaintRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO requestDTO) {
        Student student = studentRepository.findByStudentId(requestDTO.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with studentId: " + requestDTO.getStudentId()));

        Complaint complaint = Complaint.builder()
                .title(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .category(requestDTO.getCategory())
                .status(ComplaintStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .student(student)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);
        return mapToResponseDTO(savedComplaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponseDTO> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponseDTO> getComplaintsByStudent(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with studentId: " + studentId));

        return complaintRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintResponseDTO updateComplaintStatus(Long complaintId, AdminDecisionDTO decisionDTO) {
        if (decisionDTO.getStatus() != ComplaintStatus.APPROVED && decisionDTO.getStatus() != ComplaintStatus.REJECTED) {
            throw new IllegalArgumentException("Admin decision status must be APPROVED or REJECTED");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with id: " + complaintId));

        complaint.setStatus(decisionDTO.getStatus());
        if (decisionDTO.getAdminRemark() != null) {
            complaint.setAdminRemark(decisionDTO.getAdminRemark());
        }

        Complaint updatedComplaint = complaintRepository.save(complaint);
        return mapToResponseDTO(updatedComplaint);
    }

    private ComplaintResponseDTO mapToResponseDTO(Complaint complaint) {
        return ComplaintResponseDTO.builder()
                .id(complaint.getId())
                .studentId(complaint.getStudent() != null ? complaint.getStudent().getStudentId() : null)
                .studentName(complaint.getStudent() != null ? complaint.getStudent().getName() : null)
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .adminRemark(complaint.getAdminRemark())
                .build();
    }
}
