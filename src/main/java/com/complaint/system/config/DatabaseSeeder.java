package com.complaint.system.config;

import com.complaint.system.model.Complaint;
import com.complaint.system.model.ComplaintStatus;
import com.complaint.system.model.Student;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final ComplaintRepository complaintRepository;

    public DatabaseSeeder(StudentRepository studentRepository, ComplaintRepository complaintRepository) {
        this.studentRepository = studentRepository;
        this.complaintRepository = complaintRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            Student student1 = Student.builder()
                    .name("Alice Smith")
                    .studentId("STU001")
                    .email("alice.smith@university.edu")
                    .build();

            Student student2 = Student.builder()
                    .name("Bob Jones")
                    .studentId("STU002")
                    .email("bob.jones@university.edu")
                    .build();

            studentRepository.save(student1);
            studentRepository.save(student2);

            Complaint complaint = Complaint.builder()
                    .title("Wifi Connectivity Issue in Hostel Room 204")
                    .description("The Wi-Fi router on 2nd floor is not connecting to student portal.")
                    .category("HOSTEL")
                    .status(ComplaintStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .student(student1)
                    .build();

            complaintRepository.save(complaint);
        }
    }
}
