package com.hrms.payrollservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "payroll_records")
public class PayrollRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String employeeId;

  @Column(nullable = false)
  private String employeeName;

  @Column(nullable = false)
  private String payMonth;

  @Column(nullable = false)
  private double baseSalary;

  @Column(nullable = false)
  private double bonus;

  @Column(nullable = false)
  private double deductions;

  @Column(nullable = false)
  private double netSalary;

  @Column(nullable = false)
  private String status;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  public PayrollRecord() {}

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
    if (status == null || status.isBlank()) {
      status = "DRAFT";
    }
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getEmployeeId() { return employeeId; }
  public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
  public String getEmployeeName() { return employeeName; }
  public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
  public String getPayMonth() { return payMonth; }
  public void setPayMonth(String payMonth) { this.payMonth = payMonth; }
  public double getBaseSalary() { return baseSalary; }
  public void setBaseSalary(double baseSalary) { this.baseSalary = baseSalary; }
  public double getBonus() { return bonus; }
  public void setBonus(double bonus) { this.bonus = bonus; }
  public double getDeductions() { return deductions; }
  public void setDeductions(double deductions) { this.deductions = deductions; }
  public double getNetSalary() { return netSalary; }
  public void setNetSalary(double netSalary) { this.netSalary = netSalary; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
