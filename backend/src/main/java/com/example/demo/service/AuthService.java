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
        System.out.println("--> Login Request Received! Email: '" + request.getEmail() + "'");

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            System.out.println("--> ERROR: User not found in MongoDB!");
            return AuthResponseDTO.builder().success(false).message("User not found").build();
        }

        System.out.println("--> User Found in DB: " + user.getFirstName() + ". Checking password...");

        if (user.getPassword().equals(request.getPassword())) {
            System.out.println("--> SUCCESS: Password Matched!");
            return AuthResponseDTO.builder()
                    .id(user.getId())
                    .name(user.getFirstName() + " " + user.getLastName())
                    .role(user.getRole())
                    .avatarInitials(user.getAvatarInitials())
                    .success(true)
                    .message("Login successful")
                    .build();
        } else {
            System.out.println("--> ERROR: Password Mismatch! DB Password: '" + user.getPassword() + "', Entered: '"
                    + request.getPassword() + "'");
        }

        return AuthResponseDTO.builder()
                .success(false)
                .message("Invalid email or password")
                .build();
    }
}