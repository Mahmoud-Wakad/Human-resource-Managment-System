package com.hrms.leaveattendanceservice.service;

import com.hrms.leaveattendanceservice.dto.AttendanceRequest;
import com.hrms.leaveattendanceservice.dto.LeaveDecisionRequest;
import com.hrms.leaveattendanceservice.dto.LeaveRequestPayload;
import com.hrms.leaveattendanceservice.entity.AttendanceRecord;
import com.hrms.leaveattendanceservice.entity.LeaveRequest;
import com.hrms.leaveattendanceservice.repository.AttendanceRecordRepository;
import com.hrms.leaveattendanceservice.repository.LeaveRequestRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WorkflowService {
  private final LeaveRequestRepository leaveRepository;
  private final AttendanceRecordRepository attendanceRepository;

  public WorkflowService(LeaveRequestRepository leaveRepository, AttendanceRecordRepository attendanceRepository) {
    this.leaveRepository = leaveRepository;
    this.attendanceRepository = attendanceRepository;
  }

  public List<LeaveRequest> findLeaves() {
    return leaveRepository.findAll();
  }

  public LeaveRequest createLeave(LeaveRequestPayload payload) {
    LeaveRequest request = new LeaveRequest();
    request.setEmployeeId(payload.employeeId());
    request.setEmployeeName(payload.employeeName());
    request.setLeaveType(payload.leaveType());
    request.setReason(payload.reason());
    request.setStartDate(payload.startDate());
    request.setEndDate(payload.endDate());
    request.setStatus("PENDING");
    return leaveRepository.save(request);
  }

  public LeaveRequest resolveLeave(String id, LeaveDecisionRequest payload) {
    LeaveRequest request = leaveRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Leave request not found"));
    request.setStatus(payload.status().toUpperCase());
    request.setDecidedBy(payload.decidedBy());
    return leaveRepository.save(request);
  }

  public List<AttendanceRecord> findAttendance() {
    return attendanceRepository.findAll();
  }

  public AttendanceRecord saveAttendance(AttendanceRequest payload) {
    AttendanceRecord record = new AttendanceRecord();
    record.setEmployeeId(payload.employeeId());
    record.setEmployeeName(payload.employeeName());
    record.setAttendanceDate(payload.attendanceDate());
    record.setCheckInTime(payload.checkInTime());
    record.setCheckOutTime(payload.checkOutTime());
    record.setStatus(payload.status().toUpperCase());
    record.setMode(payload.mode());
    record.setNotes(payload.notes());
    return attendanceRepository.save(record);
  }
}
