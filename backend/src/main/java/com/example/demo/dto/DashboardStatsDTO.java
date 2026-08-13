package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    // Stores data for the 4 main dashboard cards
    private long activeInterns;
    private long activeProjects;
    private long pendingTasks;
    private long completedTasks;
}