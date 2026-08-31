package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable String id, @RequestBody ProfileUpdateRequest request) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setDesignation(request.getDesignation());
            user.setDepartment(request.getDepartment());
            user.setSkills(request.getSkills());

            String initials = "";
            if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
                initials += request.getFirstName().substring(0, 1).toUpperCase();
            }
            if (request.getLastName() != null && !request.getLastName().isEmpty()) {
                initials += request.getLastName().substring(0, 1).toUpperCase();
            }
            user.setAvatarInitials(initials);

            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody PasswordChangeRequest request) {
        return userRepository.findById(id).map(user -> {
            if (!user.getPassword().equals(request.getCurrentPassword())) {
                return ResponseEntity.badRequest().body("{\"message\": \"Incorrect current password\"}");
            }
            user.setPassword(request.getNewPassword());
            userRepository.save(user);
            return ResponseEntity.ok().body("{\"message\": \"Password updated successfully\"}");
        }).orElse(ResponseEntity.notFound().build());
    }
}

@Data
class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String designation;
    private String department;
    private List<String> skills;
}

@Data
class PasswordChangeRequest {
    private String currentPassword;
    private String newPassword;
}