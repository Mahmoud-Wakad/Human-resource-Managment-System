package com.hrms.leaveattendanceservice.dto;

import jakarta.validation.constraints.NotBlank;

public record LeaveDecisionRequest(
  @NotBlank String status,
  String decidedBy
) {}
