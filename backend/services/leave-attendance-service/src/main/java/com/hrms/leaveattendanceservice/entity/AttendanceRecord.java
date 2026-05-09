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
import java.time.LocalTime;

@Entity
@Table(name = "attendance_records")
public class AttendanceRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String employeeId;

  @Column(nullable = false)
  private String employeeName;

  @Column(nullable = false)
  private LocalDate attendanceDate;

  private LocalTime checkInTime;
  private LocalTime checkOutTime;

  @Column(nullable = false)
  private String status;

  @Column(nullable = false)
  private String mode;

  private String notes;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  public AttendanceRecord() {}

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
    if (status == null || status.isBlank()) {
      status = "PRESENT";
    }
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getEmployeeId() { return employeeId; }
  public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
  public String getEmployeeName() { return employeeName; }
  public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
  public LocalDate getAttendanceDate() { return attendanceDate; }
  public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }
  public LocalTime getCheckInTime() { return checkInTime; }
  public void setCheckInTime(LocalTime checkInTime) { this.checkInTime = checkInTime; }
  public LocalTime getCheckOutTime() { return checkOutTime; }
  public void setCheckOutTime(LocalTime checkOutTime) { this.checkOutTime = checkOutTime; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getMode() { return mode; }
  public void setMode(String mode) { this.mode = mode; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
