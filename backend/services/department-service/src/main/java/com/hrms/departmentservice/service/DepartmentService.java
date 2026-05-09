package com.hrms.departmentservice.service;

import com.hrms.departmentservice.entity.Department;
import com.hrms.departmentservice.repository.DepartmentRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {
  private final DepartmentRepository repository;
  public DepartmentService(DepartmentRepository repository) { this.repository = repository; }
  public List<Department> findAll() { return repository.findAll(); }
  public Department save(Department department) { return repository.save(department); }
  public void delete(String id) { repository.deleteById(id); }
}
