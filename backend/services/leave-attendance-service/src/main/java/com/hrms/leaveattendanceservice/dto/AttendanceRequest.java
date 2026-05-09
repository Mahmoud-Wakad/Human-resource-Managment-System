package com.hrms.leaveattendanceservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceRequest(
  @NotBlank String employeeId,
  @NotBlank String employeeName,
  @NotNull LocalDate attendanceDate,
  LocalTime checkInTime,
  LocalTime checkOutTime,
  @NotBlank String status,
  @NotBlank String mode,
  String notes
) {}
