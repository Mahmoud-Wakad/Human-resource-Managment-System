package com.hrms.employeeservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;
  @Column(nullable = false, unique = true)
  private String employeeId;
  private String fullName;
  private String email;
  private String phone;
  private String departmentId;
  private String position;
  private String contractType;
  private String status;
  private String manager;
  private double salary;
  private String joinDate;

  public Employee() {}
  public Employee(String id, String employeeId, String fullName, String email, String phone, String departmentId, String position, String contractType, String status, String manager, double salary, String joinDate) {
    this.id = id; this.employeeId = employeeId; this.fullName = fullName; this.email = email; this.phone = phone; this.departmentId = departmentId; this.position = position; this.contractType = contractType; this.status = status; this.manager = manager; this.salary = salary; this.joinDate = joinDate;
  }
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getEmployeeId() { return employeeId; }
  public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
  public String getFullName() { return fullName; }
  public void setFullName(String fullName) { this.fullName = fullName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
  public String getDepartmentId() { return departmentId; }
  public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
  public String getPosition() { return position; }
  public void setPosition(String position) { this.position = position; }
  public String getContractType() { return contractType; }
  public void setContractType(String contractType) { this.contractType = contractType; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getManager() { return manager; }
  public void setManager(String manager) { this.manager = manager; }
  public double getSalary() { return salary; }
  public void setSalary(double salary) { this.salary = salary; }
  public String getJoinDate() { return joinDate; }
  public void setJoinDate(String joinDate) { this.joinDate = joinDate; }
}
