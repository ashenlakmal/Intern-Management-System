package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {

    @Id
    private String id;

    private String name;
    private String description;
    private String status; // e.g., "ACTIVE", "ARCHIVED"

    private List<String> techStack; // e.g., ["Angular", "Spring Boot", "AWS"]
    private LocalDate deadline;

    private int progressPercentage; // e.g., 65

    private List<String> teamMemberIds;
}