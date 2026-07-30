package com.complaint.system.dto;

import com.complaint.system.model.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponseDTO {

    private Long id;
    private String studentId;
    private String studentName;
    private String title;
    private String description;
    private String category;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
    private String adminRemark;
}
