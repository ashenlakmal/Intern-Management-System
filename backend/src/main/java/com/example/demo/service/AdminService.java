package com.example.demo.service;

import com.example.demo.dto.ActivityLogDTO;
import com.example.demo.dto.DashboardStatsDTO;
import com.example.demo.model.Project;
import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

        private final UserRepository userRepository;
        private final ProjectRepository projectRepository; // Now we have this!
        private final TaskRepository taskRepository; // Now we have this!

        public DashboardStatsDTO getDashboardStats() {

                // Fetch everything from DB
                List<User> allUsers = userRepository.findAll();
                List<Project> allProjects = projectRepository.findAll();
                List<Task> allTasks = taskRepository.findAll();

                // 1. Calculate Active Interns (Role must be INTERN and status Active)
                long activeInternsCount = allUsers.stream()
                                .filter(u -> "INTERN".equalsIgnoreCase(u.getRole())
                                                && "Active".equalsIgnoreCase(u.getStatus()))
                                .count();

                // 2. Calculate Active Projects
                long activeProjectsCount = allProjects.stream()
                                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()))
                                .count();

                // 3. Calculate Pending Tasks (TO_DO or IN_PROGRESS)
                long pendingTasksCount = allTasks.stream()
                                .filter(t -> "TO_DO".equalsIgnoreCase(t.getStatus())
                                                || "IN_PROGRESS".equalsIgnoreCase(t.getStatus()))
                                .count();

                // 4. Calculate Completed Tasks
                long completedTasksCount = allTasks.stream()
                                .filter(t -> "DONE".equalsIgnoreCase(t.getStatus()))
                                .count();

                // 5. Calculate Overdue Tasks
                LocalDate today = LocalDate.now();
                long overdueTasksCount = allTasks.stream()
                                .filter(t -> !"DONE".equalsIgnoreCase(t.getStatus()) && t.getDueDate() != null
                                                && t.getDueDate().isBefore(today))
                                .count();

                // 6. Generate Dynamic Recent Activity Feed based on latest Tasks
                List<ActivityLogDTO> activities = new ArrayList<>();

                // Reverse the list to get the newest tasks first (simple approach)
                List<Task> recentTasks = new ArrayList<>(allTasks);
                Collections.reverse(recentTasks);

                int count = 0;
                for (Task t : recentTasks) {
                        if (count >= 4)
                                break; // Get only top 4

                        String statusLabel = "Active";
                        if ("DONE".equalsIgnoreCase(t.getStatus()))
                                statusLabel = "Completed";
                        else if (t.getDueDate() != null && t.getDueDate().isBefore(today))
                                statusLabel = "Overdue";

                        activities.add(ActivityLogDTO.builder()
                                        .id(t.getId())
                                        .message("Task Update: " + t.getTitle())
                                        .timeAgo("Recently") // In a real app, calculate time diff from a 'createdAt'
                                                             // timestamp
                                        .status(statusLabel)
                                        .build());
                        count++;
                }

                // Default message if no tasks exist yet
                if (activities.isEmpty()) {
                        activities.add(ActivityLogDTO.builder()
                                        .message("System Ready: Welcome to Internship Hub")
                                        .timeAgo("Just now")
                                        .status("Active")
                                        .build());
                }

                // --- NEW: Fetch Recent Projects & Tasks for Cards ---
                List<Project> sortedProjects = new ArrayList<>(allProjects);
                Collections.reverse(sortedProjects);
                List<Project> top3Projects = sortedProjects.stream().limit(3).toList();

                List<Task> sortedTasks = new ArrayList<>(allTasks);
                Collections.reverse(sortedTasks);
                List<Task> top3Tasks = sortedTasks.stream().limit(3).toList();

                return DashboardStatsDTO.builder()
                                .activeInterns(activeInternsCount)
                                .activeProjects(activeProjectsCount)
                                .pendingTasks(pendingTasksCount)
                                .completedTasks(completedTasksCount)
                                .overdueTasks(overdueTasksCount)
                                .recentActivities(activities)
                                // --- NEW DATA ---
                                .recentProjects(top3Projects)
                                .recentTasks(top3Tasks)
                                .build();
        }
}