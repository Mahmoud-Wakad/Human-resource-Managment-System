package com.hrms.payrollservice.repository;

import com.hrms.payrollservice.entity.PayrollRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollRepository extends JpaRepository<PayrollRecord, String> {}
