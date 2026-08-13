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
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private String password; // Hashed password for security

    private String role; // e.g., "ADMIN", "INTERN_FRONTEND", "INTERN_UIUX"
    private String status; // e.g., "Active", "Inactive"
    private String avatarInitials; // e.g., "SJ", "JS"
    private String designation;

    private String department;
    private String managerName;
    private LocalDate startDate;
    private List<String> skills; // e.g., ["UX Design", "Wireframing", "React"]

    private List<String> activeProjectIds;
}