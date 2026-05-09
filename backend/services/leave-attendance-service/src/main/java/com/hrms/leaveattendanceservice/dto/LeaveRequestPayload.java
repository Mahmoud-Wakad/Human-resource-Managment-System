package com.hrms.leaveattendanceservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record LeaveRequestPayload(
  @NotBlank String employeeId,
  @NotBlank String employeeName,
  @NotBlank String leaveType,
  @NotBlank String reason,
  @NotNull LocalDate startDate,
  @NotNull LocalDate endDate
) {}
