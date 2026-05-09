package com.hrms.payrollservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record PayrollRequest(
  @NotBlank String employeeId,
  @NotBlank String employeeName,
  @NotNull @PositiveOrZero Double baseSalary,
  @NotNull @PositiveOrZero Double bonus,
  @NotNull @PositiveOrZero Double deductions,
  @NotBlank String payMonth,
  String status
) {}
