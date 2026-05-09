package com.hrms.leaveattendanceservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String employeeId;

  @Column(nullable = false)
  private String employeeName;

  @Column(nullable = false)
  private String leaveType;

  @Column(nullable = false, length = 1000)
  private String reason;

  @Column(nullable = false)
  private LocalDate startDate;

  @Column(nullable = false)
  private LocalDate endDate;

  @Column(nullable = false)
  private String status;

  private String decidedBy;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  public LeaveRequest() {}

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
    if (status == null || status.isBlank()) {
      status = "PENDING";
    }
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getEmployeeId() { return employeeId; }
  public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
  public String getEmployeeName() { return employeeName; }
  public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
  public String getLeaveType() { return leaveType; }
  public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
  public LocalDate getEndDate() { return endDate; }
  public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getDecidedBy() { return decidedBy; }
  public void setDecidedBy(String decidedBy) { this.decidedBy = decidedBy; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
