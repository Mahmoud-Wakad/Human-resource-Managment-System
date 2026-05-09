package com.hrms.payrollservice.service;

import com.hrms.payrollservice.dto.PayrollRequest;
import com.hrms.payrollservice.entity.PayrollRecord;
import com.hrms.payrollservice.repository.PayrollRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PayrollService {
  private final PayrollRepository repository;

  public PayrollService(PayrollRepository repository) {
    this.repository = repository;
  }

  public List<PayrollRecord> findAll() {
    return repository.findAll();
  }

  public PayrollRecord create(PayrollRequest request) {
    PayrollRecord record = new PayrollRecord();
    apply(record, request);
    return repository.save(record);
  }

  public PayrollRecord update(String id, PayrollRequest request) {
    PayrollRecord record = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Payroll record not found"));
    apply(record, request);
    record.setId(id);
    return repository.save(record);
  }

  public void delete(String id) {
    repository.deleteById(id);
  }

  private void apply(PayrollRecord record, PayrollRequest request) {
    record.setEmployeeId(request.employeeId());
    record.setEmployeeName(request.employeeName());
    record.setBaseSalary(request.baseSalary());
    record.setBonus(request.bonus());
    record.setDeductions(request.deductions());
    record.setPayMonth(request.payMonth());
    record.setStatus(request.status() == null || request.status().isBlank() ? "DRAFT" : request.status().toUpperCase());
    record.setNetSalary(Math.max(0d, request.baseSalary() + request.bonus() - request.deductions()));
  }
}
