package com.hrms.leaveattendanceservice.repository;

import com.hrms.leaveattendanceservice.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {}
