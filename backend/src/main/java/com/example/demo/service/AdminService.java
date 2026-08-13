package com.example.demo.service;

import com.example.demo.dto.DashboardStatsDTO;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    // Calculate and return statistics for the admin dashboard
    public DashboardStatsDTO getDashboardStats() {

        // Get counts dynamically from the database
        long activeInternsCount = userRepository.countByStatus("Active");
        long activeProjectsCount = projectRepository.countByStatus("ACTIVE");

        // Build the DTO to send to the frontend
        return DashboardStatsDTO.builder()
                .activeInterns(activeInternsCount)
                .activeProjects(activeProjectsCount)
                .pendingTasks(94) // Hardcoded temporarily until task model is built
                .completedTasks(2758) // Hardcoded temporarily until task model is built
                .build();
    }
}