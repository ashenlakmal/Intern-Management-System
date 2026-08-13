package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Find user by email for login process
    User findByEmail(String email);

    // Count users based on their active or inactive status
    long countByStatus(String status);

    // Fetch users by their role for filtering in the UI
    List<User> findByRole(String role);
}