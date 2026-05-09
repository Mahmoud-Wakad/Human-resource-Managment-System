package com.hrms.leaveattendanceservice.config;

import com.hrms.leaveattendanceservice.entity.AttendanceRecord;
import com.hrms.leaveattendanceservice.entity.LeaveRequest;
import com.hrms.leaveattendanceservice.repository.AttendanceRecordRepository;
import com.hrms.leaveattendanceservice.repository.LeaveRequestRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
  @Bean
  CommandLineRunner seedWorkflow(LeaveRequestRepository leaveRepository, AttendanceRecordRepository attendanceRepository) {
    return args -> {
      if (leaveRepository.count() == 0) {
        LeaveRequest leave = new LeaveRequest();
        leave.setEmployeeId("e4");
        leave.setEmployeeName("Salma Ibrahim");
        leave.setLeaveType("Annual");
        leave.setReason("Family travel");
        leave.setStartDate(LocalDate.of(2026, 4, 21));
        leave.setEndDate(LocalDate.of(2026, 4, 24));
        leave.setStatus("PENDING");
        leave.setDecidedBy("Mona Adel");
        leave.setCreatedAt(Instant.parse("2026-04-15T09:30:00Z"));
        leaveRepository.save(leave);
      }

      if (attendanceRepository.count() == 0) {
        AttendanceRecord a = new AttendanceRecord();
        a.setEmployeeId("e1");
        a.setEmployeeName("Amina Hassan");
        a.setAttendanceDate(LocalDate.of(2026, 4, 17));
        a.setCheckInTime(LocalTime.of(8, 14));
        a.setCheckOutTime(LocalTime.of(16, 42));
        a.setStatus("PRESENT");
        a.setMode("On-site");
        a.setNotes("HQ");
        a.setCreatedAt(Instant.parse("2026-04-17T14:00:00Z"));

        AttendanceRecord b = new AttendanceRecord();
        b.setEmployeeId("e2");
        b.setEmployeeName("Omar Nabil");
        b.setAttendanceDate(LocalDate.of(2026, 4, 17));
        b.setCheckInTime(LocalTime.of(8, 22));
        b.setCheckOutTime(LocalTime.of(16, 35));
        b.setStatus("LATE");
        b.setMode("On-site");
        b.setNotes("HQ");
        b.setCreatedAt(Instant.parse("2026-04-17T14:10:00Z"));

        AttendanceRecord c = new AttendanceRecord();
        c.setEmployeeId("e3");
        c.setEmployeeName("Mona Adel");
        c.setAttendanceDate(LocalDate.of(2026, 4, 17));
        c.setCheckInTime(LocalTime.of(8, 3));
        c.setCheckOutTime(LocalTime.of(17, 0));
        c.setStatus("REMOTE");
        c.setMode("Remote");
        c.setNotes("Remote work");
        c.setCreatedAt(Instant.parse("2026-04-17T14:15:00Z"));

        attendanceRepository.saveAll(List.of(a, b, c));
      }
    };
  }
}
