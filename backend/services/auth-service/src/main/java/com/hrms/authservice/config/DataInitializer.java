package com.hrms.authservice.config;

import com.hrms.authservice.entity.UserAccount;
import com.hrms.authservice.repository.UserAccountRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
  @Bean
  CommandLineRunner seedUsers(UserAccountRepository repository, PasswordEncoder passwordEncoder) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }

      repository.saveAll(List.of(
        new UserAccount(null, "Amina Hassan", "admin@hrms.local", passwordEncoder.encode("Admin@12345"), "Admin", "d2", "e1"),
        new UserAccount(null, "Omar Nabil", "hr@hrms.local", passwordEncoder.encode("Hr@12345"), "HR Manager", "d2", "e2"),
        new UserAccount(null, "Mona Adel", "manager@hrms.local", passwordEncoder.encode("Manager@12345"), "Department Manager", "d3", "e3"),
        new UserAccount(null, "Salma Ibrahim", "employee@hrms.local", passwordEncoder.encode("Employee@12345"), "Employee", "d3", "e4")
      ));
    };
  }
}
