package com.hrms.employeeservice.config;

import com.hrms.employeeservice.entity.Employee;
import com.hrms.employeeservice.repository.EmployeeRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
  @Bean
  CommandLineRunner seedEmployees(EmployeeRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }

      repository.saveAll(List.of(
        new Employee(null, "EMP-1001", "Amina Hassan", "admin@hrms.local", "+20 100 111 2221", "d2", "Chief HR Officer", "Permanent", "Active", "University Board", 18000, "2023-09-18"),
        new Employee(null, "EMP-1002", "Omar Nabil", "hr@hrms.local", "+20 100 111 2222", "d2", "HR Manager", "Permanent", "Active", "Amina Hassan", 15000, "2024-01-10"),
        new Employee(null, "EMP-1003", "Mona Adel", "manager@hrms.local", "+20 100 111 2223", "d3", "Department Manager", "Permanent", "Active", "Amina Hassan", 16000, "2024-04-12"),
        new Employee(null, "EMP-1004", "Salma Ibrahim", "employee@hrms.local", "+20 100 111 2224", "d3", "Software Engineer", "Permanent", "Active", "Mona Adel", 12000, "2024-08-01")
      ));
    };
  }
}
