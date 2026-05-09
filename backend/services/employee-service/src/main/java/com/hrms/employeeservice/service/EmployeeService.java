package com.hrms.employeeservice.service;

import com.hrms.employeeservice.entity.Employee;
import com.hrms.employeeservice.repository.EmployeeRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
  private final EmployeeRepository repository;
  public EmployeeService(EmployeeRepository repository) { this.repository = repository; }
  public List<Employee> findAll() { return repository.findAll(); }
  public Employee save(Employee employee) { return repository.save(employee); }
  public Employee update(String id, Employee employee) { employee.setId(id); return repository.save(employee); }
  public void delete(String id) { repository.deleteById(id); }
}
