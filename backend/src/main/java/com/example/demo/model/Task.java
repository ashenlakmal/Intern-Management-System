package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String title;
    private String description;

    private String projectId; // Relates to Project
    private String assigneeId; // Relates to User (Intern)

    private String priority; // HIGH, MEDIUM, LOW
    private String status; // TO_DO, IN_PROGRESS, REVIEW, DONE

    private LocalDate dueDate;
}