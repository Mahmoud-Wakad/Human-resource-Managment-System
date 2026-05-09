package com.hrms.departmentservice.config;

import com.hrms.departmentservice.entity.Department;
import com.hrms.departmentservice.repository.DepartmentRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
  @Bean
  CommandLineRunner seedDepartments(DepartmentRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }

      repository.saveAll(List.of(
        new Department(null, "Finance", "Amina Hassan", "Main Campus", 180000, 3, "Active"),
        new Department(null, "Human Resources", "Omar Nabil", "HQ - Floor 2", 120000, 4, "Active"),
        new Department(null, "Information Technology", "Mona Adel", "Tech Hub", 240000, 5, "Active")
      ));
    };
  }
}
