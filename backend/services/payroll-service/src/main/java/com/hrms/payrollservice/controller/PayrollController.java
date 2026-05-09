package com.hrms.payrollservice.controller;

import com.hrms.payrollservice.dto.PayrollRequest;
import com.hrms.payrollservice.entity.PayrollRecord;
import com.hrms.payrollservice.service.PayrollService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {
  private final PayrollService service;

  public PayrollController(PayrollService service) {
    this.service = service;
  }

  @GetMapping("/health")
  public ResponseEntity<Map<String, String>> health() {
    return ResponseEntity.ok(Map.of("service", "payroll-service", "status", "UP"));
  }

  @GetMapping("/slips")
  public ResponseEntity<List<PayrollRecord>> slips() {
    return ResponseEntity.ok(service.findAll());
  }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @PostMapping("/run")
  public ResponseEntity<PayrollRecord> run(@Valid @RequestBody PayrollRequest request) {
    return ResponseEntity.ok(service.create(request));
  }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @PutMapping("/{id}")
  public ResponseEntity<PayrollRecord> update(@PathVariable String id, @Valid @RequestBody PayrollRequest request) {
    return ResponseEntity.ok(service.update(id, request));
  }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
    service.delete(id);
    return ResponseEntity.ok(Map.of("message", "Payroll record deleted", "id", id));
  }
}
