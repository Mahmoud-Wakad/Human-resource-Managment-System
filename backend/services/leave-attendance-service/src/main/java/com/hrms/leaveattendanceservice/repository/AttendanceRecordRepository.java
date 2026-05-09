package com.hrms.leaveattendanceservice.repository;

import com.hrms.leaveattendanceservice.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, String> {}
