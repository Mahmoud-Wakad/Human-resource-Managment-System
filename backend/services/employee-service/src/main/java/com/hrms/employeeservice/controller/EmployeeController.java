package com.hrms.employeeservice.controller;

import com.hrms.employeeservice.entity.Employee;
import com.hrms.employeeservice.service.EmployeeService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
  private final EmployeeService service;
  public EmployeeController(EmployeeService service) { this.service = service; }

  @GetMapping("/health")
  public ResponseEntity<Map<String, String>> health() { return ResponseEntity.ok(Map.of("service", "employee-service", "status", "UP")); }

  @GetMapping
  public ResponseEntity<?> list() { return ResponseEntity.ok(service.findAll()); }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @PostMapping
  public ResponseEntity<Employee> create(@RequestBody Employee employee) { return ResponseEntity.ok(service.save(employee)); }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @PutMapping("/{id}")
  public ResponseEntity<Employee> update(@PathVariable String id, @RequestBody Employee employee) { return ResponseEntity.ok(service.update(id, employee)); }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, String>> delete(@PathVariable String id) { service.delete(id); return ResponseEntity.ok(Map.of("message", "Employee deleted", "id", id)); }
}
