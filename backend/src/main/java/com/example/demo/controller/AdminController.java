package com.example.demo.controller;

import com.example.demo.dto.DashboardStatsDTO;
import com.example.demo.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*") // Allows Angular to access this
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // This is the exact endpoint Angular is calling!
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}