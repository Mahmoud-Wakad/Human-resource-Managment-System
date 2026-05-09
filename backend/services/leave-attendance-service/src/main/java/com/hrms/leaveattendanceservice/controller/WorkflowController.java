package com.hrms.leaveattendanceservice.controller;

import com.hrms.leaveattendanceservice.dto.AttendanceRequest;
import com.hrms.leaveattendanceservice.dto.LeaveDecisionRequest;
import com.hrms.leaveattendanceservice.dto.LeaveRequestPayload;
import com.hrms.leaveattendanceservice.entity.AttendanceRecord;
import com.hrms.leaveattendanceservice.entity.LeaveRequest;
import com.hrms.leaveattendanceservice.service.WorkflowService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class WorkflowController {
  private final WorkflowService service;

  public WorkflowController(WorkflowService service) {
    this.service = service;
  }

  @GetMapping({"/leaves/health", "/attendance/health"})
  public ResponseEntity<Map<String, String>> health() {
    return ResponseEntity.ok(Map.of("service", "leave-attendance-service", "status", "UP"));
  }

  @GetMapping("/leaves")
  public ResponseEntity<List<LeaveRequest>> leaves() {
    return ResponseEntity.ok(service.findLeaves());
  }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','EMPLOYEE')")
  @PostMapping("/leaves")
  public ResponseEntity<LeaveRequest> submitLeave(@Valid @RequestBody LeaveRequestPayload payload) {
    return ResponseEntity.ok(service.createLeave(payload));
  }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @PatchMapping("/leaves/{id}")
  public ResponseEntity<LeaveRequest> resolveLeave(@PathVariable String id, @Valid @RequestBody LeaveDecisionRequest payload) {
    return ResponseEntity.ok(service.resolveLeave(id, payload));
  }

  @GetMapping("/attendance")
  public ResponseEntity<List<AttendanceRecord>> attendance() {
    return ResponseEntity.ok(service.findAttendance());
  }

  @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER')")
  @PostMapping("/attendance")
  public ResponseEntity<AttendanceRecord> saveAttendance(@Valid @RequestBody AttendanceRequest payload) {
    return ResponseEntity.ok(service.saveAttendance(payload));
  }
}
