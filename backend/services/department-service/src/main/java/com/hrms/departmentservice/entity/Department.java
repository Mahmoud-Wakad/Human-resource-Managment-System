package com.hrms.departmentservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;
  private String name;
  private String manager;
  private String location;
  private double budget;
  private int headcount;
  private String status;

  public Department() {}
  public Department(String id, String name, String manager, String location, double budget, int headcount, String status) { this.id = id; this.name = name; this.manager = manager; this.location = location; this.budget = budget; this.headcount = headcount; this.status = status; }
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getManager() { return manager; }
  public void setManager(String manager) { this.manager = manager; }
  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }
  public double getBudget() { return budget; }
  public void setBudget(double budget) { this.budget = budget; }
  public int getHeadcount() { return headcount; }
  public void setHeadcount(int headcount) { this.headcount = headcount; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}
