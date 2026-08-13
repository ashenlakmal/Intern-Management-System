package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardStatsDTO {
    private long activeInterns;
    private long activeProjects;
    private long pendingTasks;
    private long completedTasks;
    private long overdueTasks; // Added for the red card
    private List<ActivityLogDTO> recentActivities; // Added for the activity feed
}