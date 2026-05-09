package com.hrms.authservice;

import com.hrms.authservice.entity.UserAccount;
import com.hrms.authservice.repository.UserAccountRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class HrmsAuthServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(HrmsAuthServiceApplication.class, args);
  }

  @Bean
  CommandLineRunner seedUsers(UserAccountRepository repository, PasswordEncoder encoder) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }

      repository.saveAll(List.of(
        new UserAccount(null, "Amina Hassan", "admin@hrms.local", encoder.encode("Admin@12345"), "Admin", "dept-hr", "emp-1001"),
        new UserAccount(null, "Omar Nabil", "hr@hrms.local", encoder.encode("Hr@12345"), "HR Manager", "dept-hr", "emp-1002"),
        new UserAccount(null, "Mona Adel", "manager@hrms.local", encoder.encode("Manager@12345"), "Department Manager", "dept-it", "emp-1003"),
        new UserAccount(null, "Salma Ibrahim", "employee@hrms.local", encoder.encode("Employee@12345"), "Employee", "dept-it", "emp-1004")
      ));
    };
  }
}
