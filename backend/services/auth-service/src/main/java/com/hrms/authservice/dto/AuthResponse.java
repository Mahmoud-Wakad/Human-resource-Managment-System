package com.hrms.authservice.dto;

public record AuthResponse(String token, String fullName, String email, String role, String departmentId, String employeeId) {}
