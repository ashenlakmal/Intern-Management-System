package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActivityLogDTO {
    private String id;
    private String message;
    private String timeAgo;
    private String status; // e.g., "Approved", "Completed", "Active", "Overdue"
}