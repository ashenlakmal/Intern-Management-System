package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interns")
@CrossOrigin(origins = "*") // Allows Angular frontend to call these APIs
@RequiredArgsConstructor
public class InternController {

    private final UserRepository userRepository;

    // Fetch all interns from MongoDB
    @GetMapping
    public ResponseEntity<List<User>> getAllInterns() {
        // In a real scenario, we might filter by role. Here we fetch all users for the
        // management view.
        List<User> interns = userRepository.findAll();
        return ResponseEntity.ok(interns);
    }

    // Add a new intern to MongoDB
    @PostMapping
    public ResponseEntity<User> addIntern(@RequestBody User intern) {
        // Auto-generate Avatar Initials based on first and last name
        String initials = "";
        if (intern.getFirstName() != null && !intern.getFirstName().isEmpty()) {
            initials += intern.getFirstName().substring(0, 1).toUpperCase();
        }
        if (intern.getLastName() != null && !intern.getLastName().isEmpty()) {
            initials += intern.getLastName().substring(0, 1).toUpperCase();
        }
        intern.setAvatarInitials(initials);

        // Set default status if not provided
        if (intern.getStatus() == null || intern.getStatus().isEmpty()) {
            intern.setStatus("Active");
        }

        User savedIntern = userRepository.save(intern);
        return ResponseEntity.ok(savedIntern);
    }

    // Update an existing intern in MongoDB
    @PutMapping("/{id}")
    public ResponseEntity<User> updateIntern(@PathVariable String id, @RequestBody User updatedData) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setFirstName(updatedData.getFirstName());
            existingUser.setLastName(updatedData.getLastName());
            existingUser.setEmail(updatedData.getEmail());
            existingUser.setRole(updatedData.getRole());
            existingUser.setStatus(updatedData.getStatus());
            existingUser.setDepartment(updatedData.getDepartment());

            User savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(savedUser);
        }).orElse(ResponseEntity.notFound().build());
    }
}