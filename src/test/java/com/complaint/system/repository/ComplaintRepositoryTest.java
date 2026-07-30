package com.complaint.system.repository;

import com.complaint.system.model.Complaint;
import com.complaint.system.model.ComplaintStatus;
import com.complaint.system.model.Student;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ComplaintRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Test
    @DisplayName("Should persist Complaint associated with Student and maintain default status as PENDING")
    void testSaveComplaintAssociatedWithStudent() {
        // Arrange
        Student student = Student.builder()
                .name("Jane Doe")
                .studentId("STU100")
                .email("jane.doe@university.edu")
                .build();
        Student savedStudent = studentRepository.save(student);

        Complaint complaint = Complaint.builder()
                .title("Library Portal Login Error")
                .description("Unable to access online research papers from library portal.")
                .category("ACADEMIC")
                .student(savedStudent)
                .build();

        // Act
        Complaint savedComplaint = complaintRepository.save(complaint);

        // Assert
        assertThat(savedComplaint.getId()).isNotNull();
        assertThat(savedComplaint.getStatus()).isEqualTo(ComplaintStatus.PENDING);
        assertThat(savedComplaint.getCreatedAt()).isNotNull();

        Optional<Complaint> retrievedComplaint = complaintRepository.findById(savedComplaint.getId());
        assertThat(retrievedComplaint).isPresent();
        assertThat(retrievedComplaint.get().getTitle()).isEqualTo("Library Portal Login Error");
        assertThat(retrievedComplaint.get().getStudent().getStudentId()).isEqualTo("STU100");
        assertThat(retrievedComplaint.get().getStatus()).isEqualTo(ComplaintStatus.PENDING);
    }
}
