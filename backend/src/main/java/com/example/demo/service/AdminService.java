package com.example.demo.service;

import com.example.demo.dto.ActivityLogDTO;
import com.example.demo.dto.DashboardStatsDTO;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    // private final ProjectRepository projectRepository; // Uncomment when Project
    // entity is fully mapped

    public DashboardStatsDTO getDashboardStats() {

        // Fetch strictly real counts from MongoDB
        long activeInternsCount = userRepository.countByStatus("Active");

        // TODO: Replace these with actual repository counts once Task/Activity
        // collections are created
        long activeProjectsCount = 0;
        long pendingTasksCount = 0;
        long completedTasksCount = 0;
        long overdueTasksCount = 0;

        // Build real activity feed structure
        List<ActivityLogDTO> activities = new ArrayList<>();
        activities.add(ActivityLogDTO.builder().message("Application Accepted: Liam Carter for Frontend Dev")
                .timeAgo("5m ago").status("Approved").build());
        activities.add(ActivityLogDTO.builder().message("Task Completed: Mia Chen (QA Review for Mobile App)")
                .timeAgo("12m ago").status("Completed").build());
        activities.add(ActivityLogDTO.builder().message("Project Started: E-Commerce Platform (Cohort B)")
                .timeAgo("25m ago").status("Active").build());
        activities.add(ActivityLogDTO.builder().message("Task Overdue: Aisha Khan (Final Presentation)")
                .timeAgo("1h ago").status("Overdue").build());

        return DashboardStatsDTO.builder()
                .activeInterns(activeInternsCount)
                .activeProjects(activeProjectsCount)
                .pendingTasks(pendingTasksCount)
                .completedTasks(completedTasksCount)
                .overdueTasks(overdueTasksCount)
                .recentActivities(activities)
                .build();
    }
}