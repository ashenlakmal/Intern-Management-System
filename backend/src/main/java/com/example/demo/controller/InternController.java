package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/interns")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InternController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllInterns() {
        // STRICT FILTER: Only return users where role is exactly "INTERN"
        // This automatically hides Admins and Supervisors from the table
        List<User> interns = userRepository.findAll().stream()
                .filter(user -> "INTERN".equalsIgnoreCase(user.getRole()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(interns);
    }

    @PostMapping
    public ResponseEntity<User> addIntern(@RequestBody User intern) {
        String initials = "";
        if (intern.getFirstName() != null && !intern.getFirstName().isEmpty())
            initials += intern.getFirstName().substring(0, 1).toUpperCase();
        if (intern.getLastName() != null && !intern.getLastName().isEmpty())
            initials += intern.getLastName().substring(0, 1).toUpperCase();
        intern.setAvatarInitials(initials);

        // ENTERPRISE RULE: Force the role to be "INTERN" always
        intern.setRole("INTERN");

        if (intern.getStatus() == null || intern.getStatus().isEmpty()) {
            intern.setStatus("Active");
        }

        User savedIntern = userRepository.save(intern);
        return ResponseEntity.ok(savedIntern);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateIntern(@PathVariable String id, @RequestBody User updatedData) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setFirstName(updatedData.getFirstName());
            existingUser.setLastName(updatedData.getLastName());
            existingUser.setEmail(updatedData.getEmail());
            existingUser.setDesignation(updatedData.getDesignation()); // Added Designation
            existingUser.setDepartment(updatedData.getDepartment());
            existingUser.setStatus(updatedData.getStatus());
            // Intentionally omitting setRole() to protect the INTERN role from being
            // changed

            User savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(savedUser);
        }).orElse(ResponseEntity.notFound().build());
    }
}