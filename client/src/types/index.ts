export type ExpenseCategory = 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'education' | 'other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes?: string;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  limit: number;
  month: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BudgetAlert {
  budgetId: number;
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  status: 'safe' | 'warning' | 'exceeded';
  message: string;
}

export type Role = 'Admin' | 'HR Manager' | 'Department Manager' | 'Employee';
export type ContractType = 'Permanent' | 'Temporary' | 'Internship' | 'Contract';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Remote';
export type EmploymentStatus = 'Active' | 'On Leave' | 'Inactive';

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId?: string;
  employeeId?: string;
}

export interface AuthAccount extends SessionUser {
  password: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  location: string;
  budget: number;
  headcount: number;
  status: 'Active' | 'Planning';
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  contractType: ContractType;
  status: EmploymentStatus;
  manager: string;
  salary: number;
  joinDate: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  leaveType: 'Annual' | 'Sick' | 'Emergency' | 'Maternity' | 'Unpaid';
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
  approver: string;
  requestedAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  mode: 'On-site' | 'Hybrid' | 'Remote';
}

export interface PayrollSlip {
  employeeId: string;
  employeeName: string;
  departmentId: string;
  grossSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'Draft' | 'Processed';
}

export interface PayrollRun {
  id: string;
  month: string;
  generatedAt: string;
  totalGross: number;
  totalBonus: number;
  totalDeductions: number;
  totalNet: number;
  slips: PayrollSlip[];
}

export interface HRMSState {
  users: AuthAccount[];
  departments: Department[];
  employees: Employee[];
  leaves: LeaveRequest[];
  attendance: AttendanceRecord[];
  payrollRuns: PayrollRun[];
}
