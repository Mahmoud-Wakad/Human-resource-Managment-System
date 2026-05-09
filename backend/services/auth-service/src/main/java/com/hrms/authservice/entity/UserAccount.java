package com.hrms.authservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserAccount {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String fullName;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String passwordHash;

  @Column(nullable = false)
  private String role;

  private String departmentId;
  private String employeeId;

  public UserAccount() {}

  public UserAccount(String id, String fullName, String email, String passwordHash, String role, String departmentId, String employeeId) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.departmentId = departmentId;
    this.employeeId = employeeId;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getFullName() { return fullName; }
  public void setFullName(String fullName) { this.fullName = fullName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }
  public String getDepartmentId() { return departmentId; }
  public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
  public String getEmployeeId() { return employeeId; }
  public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
}
