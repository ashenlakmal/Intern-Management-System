package com.example.demo.service;

import com.example.demo.dto.AuthResponseDTO;
import com.example.demo.dto.LoginRequestDTO;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail());

        // Note: For MVP we use plain text password comparison.
        // In production, we should use BCryptPasswordEncoder.
        if (user != null && user.getPassword().equals(request.getPassword())) {
            return AuthResponseDTO.builder()
                    .id(user.getId())
                    .name(user.getFirstName() + " " + user.getLastName())
                    .role(user.getRole())
                    .avatarInitials(user.getAvatarInitials())
                    .success(true)
                    .message("Login successful")
                    .build();
        }

        return AuthResponseDTO.builder()
                .success(false)
                .message("Invalid email or password")
                .build();
    }
}