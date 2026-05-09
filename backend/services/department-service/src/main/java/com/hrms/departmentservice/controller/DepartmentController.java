package com.hrms.departmentservice.controller;

import com.hrms.departmentservice.entity.Department;
import com.hrms.departmentservice.service.DepartmentService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
  private final DepartmentService service;
  public DepartmentController(DepartmentService service) { this.service = service; }

  @GetMapping("/health")
  public ResponseEntity<Map<String, String>> health() { return ResponseEntity.ok(Map.of("service", "department-service", "status", "UP")); }

  @GetMapping
  public ResponseEntity<?> list() { return ResponseEntity.ok(service.findAll()); }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @PostMapping
  public ResponseEntity<Department> create(@RequestBody Department department) { return ResponseEntity.ok(service.save(department)); }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, String>> delete(@PathVariable String id) { service.delete(id); return ResponseEntity.ok(Map.of("message", "Department deleted", "id", id)); }
}
