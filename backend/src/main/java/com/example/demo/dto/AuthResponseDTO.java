package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    private String id;
    private String name;
    private String role;
    private String avatarInitials;
    private boolean success;
    private String message;
}