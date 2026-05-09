package com.hrms.payrollservice.config;

import com.hrms.payrollservice.entity.PayrollRecord;
import com.hrms.payrollservice.repository.PayrollRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
  @Bean
  CommandLineRunner seedPayroll(PayrollRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }

      PayrollRecord a = new PayrollRecord();
      a.setEmployeeId("e1");
      a.setEmployeeName("Amina Hassan");
      a.setPayMonth("2026-03");
      a.setBaseSalary(18000);
      a.setBonus(1200);
      a.setDeductions(300);
      a.setNetSalary(18900);
      a.setStatus("PROCESSED");
      a.setCreatedAt(Instant.parse("2026-03-31T10:00:00Z"));

      PayrollRecord b = new PayrollRecord();
      b.setEmployeeId("e2");
      b.setEmployeeName("Omar Nabil");
      b.setPayMonth("2026-03");
      b.setBaseSalary(15000);
      b.setBonus(1000);
      b.setDeductions(500);
      b.setNetSalary(15500);
      b.setStatus("PROCESSED");
      b.setCreatedAt(Instant.parse("2026-03-31T10:00:00Z"));

      PayrollRecord c = new PayrollRecord();
      c.setEmployeeId("e3");
      c.setEmployeeName("Mona Adel");
      c.setPayMonth("2026-03");
      c.setBaseSalary(18000);
      c.setBonus(1000);
      c.setDeductions(900);
      c.setNetSalary(18100);
      c.setStatus("PROCESSED");
      c.setCreatedAt(Instant.parse("2026-03-31T10:00:00Z"));

      repository.saveAll(List.of(a, b, c));
    };
  }
}
