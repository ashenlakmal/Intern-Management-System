package com.example.demo.controller;

import com.example.demo.model.Project;
import com.example.demo.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        if (project.getStatus() == null || project.getStatus().isEmpty()) {
            project.setStatus("ACTIVE");
        }
        if (project.getProgressPercentage() < 0)
            project.setProgressPercentage(0);
        if (project.getProgressPercentage() > 100)
            project.setProgressPercentage(100);

        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project updatedData) {
        return projectRepository.findById(id).map(existing -> {
            existing.setName(updatedData.getName());
            existing.setDescription(updatedData.getDescription());
            existing.setTechStack(updatedData.getTechStack()); // Updates the List<String>
            existing.setTeamMemberIds(updatedData.getTeamMemberIds()); // Updates the List<String>
            existing.setDeadline(updatedData.getDeadline());
            existing.setProgressPercentage(updatedData.getProgressPercentage());
            existing.setStatus(updatedData.getStatus());
            return ResponseEntity.ok(projectRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}