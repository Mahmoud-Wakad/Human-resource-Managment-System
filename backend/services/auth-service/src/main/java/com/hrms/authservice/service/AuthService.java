package com.hrms.authservice.service;

import com.hrms.authservice.dto.AuthResponse;
import com.hrms.authservice.dto.LoginRequest;
import com.hrms.authservice.dto.RegisterRequest;
import com.hrms.authservice.entity.UserAccount;
import com.hrms.authservice.repository.UserAccountRepository;
import com.hrms.authservice.security.TokenService;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AuthService {
  private final UserAccountRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final TokenService tokenService;

  public AuthService(UserAccountRepository repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
    this.repository = repository;
    this.passwordEncoder = passwordEncoder;
    this.tokenService = tokenService;
  }

  public AuthResponse register(RegisterRequest request) {
    if (repository.existsByEmailIgnoreCase(request.email())) {
      throw new IllegalArgumentException("Email already exists");
    }

    UserAccount user = new UserAccount(null, request.fullName(), request.email(), passwordEncoder.encode(request.password()), request.role(), request.departmentId(), request.role().equalsIgnoreCase("Employee") ? request.email().replace("@", "-") : null);
    repository.save(user);
    return toResponse(user);
  }

  public AuthResponse login(LoginRequest request) {
    UserAccount user = repository.findByEmailIgnoreCase(request.email()).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid credentials");
    }
    return toResponse(user);
  }

  public AuthResponse me(String email) {
    UserAccount user = repository.findByEmailIgnoreCase(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    return toResponse(user);
  }

  private AuthResponse toResponse(UserAccount user) {
    return new AuthResponse(tokenService.generate(user), user.getFullName(), user.getEmail(), user.getRole(), user.getDepartmentId(), user.getEmployeeId());
  }
}
