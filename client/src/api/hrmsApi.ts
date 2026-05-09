import axios from 'axios';
import type {
  AttendanceRecord,
  AttendanceStatus,
  Department,
  Employee,
  EmploymentStatus,
  HRMSState,
  LeaveRequest,
  LeaveStatus,
  PayrollRun,
  PayrollSlip,
  Role,
  SessionUser,
} from '@/types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const HRMS_STORAGE_KEY = 'hrms-state-v1';
export const HRMS_SESSION_KEY = 'hrms-session-v1';
export const HRMS_TOKEN_KEY = 'hrms-token-v1';

export const HRMS_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    me: '/api/auth/me',
  },
  employees: {
    list: '/api/employees',
    create: '/api/employees',
    update: '/api/employees/:id',
    remove: '/api/employees/:id',
  },
  departments: {
    list: '/api/departments',
    create: '/api/departments',
    remove: '/api/departments/:id',
  },
  payroll: {
    run: '/api/payroll/run',
    slips: '/api/payroll/slips',
  },
  leave: {
    list: '/api/leaves',
    create: '/api/leaves',
    resolve: '/api/leaves/:id',
  },
  attendance: {
    list: '/api/attendance',
    create: '/api/attendance',
  },
} as const;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(HRMS_TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface HRMSBootstrap {
  session: SessionUser | null;
  token: string | null;
}

interface AuthApiResponse {
  token: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId?: string;
  employeeId?: string;
}

interface EmployeeApiResponse {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  contractType: string;
  status: string;
  manager: string;
  salary: number;
  joinDate: string;
}

interface DepartmentApiResponse {
  id: string;
  name: string;
  manager: string;
  location: string;
  budget: number;
  headcount: number;
  status: string;
}

interface PayrollApiResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  payMonth: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: string;
  createdAt: string;
}

interface LeaveApiResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveRequest['leaveType'];
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
  decidedBy?: string;
  createdAt: string;
}

interface AttendanceApiResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  attendanceDate: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: string;
  mode: AttendanceRecord['mode'];
  notes?: string;
  createdAt: string;
}

export const hrmsApi = {
  endpoints: HRMS_ENDPOINTS,
  bootstrap(): HRMSBootstrap {
    if (typeof window === 'undefined') {
      return { session: null, token: null };
    }

    const sessionRaw = localStorage.getItem(HRMS_SESSION_KEY);
    const token = localStorage.getItem(HRMS_TOKEN_KEY);

    return {
      session: sessionRaw ? (JSON.parse(sessionRaw) as SessionUser) : null,
      token,
    };
  },
  saveSession(session: SessionUser | null, token?: string | null) {
    if (typeof window === 'undefined') {
      return;
    }

    if (session) {
      localStorage.setItem(HRMS_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(HRMS_SESSION_KEY);
    }

    if (typeof token !== 'undefined') {
      if (token) {
        localStorage.setItem(HRMS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(HRMS_TOKEN_KEY);
      }
    }
  },
  clearSession() {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(HRMS_SESSION_KEY);
    localStorage.removeItem(HRMS_TOKEN_KEY);
  },
  async register(payload: { fullName: string; email: string; password: string; role: Role; departmentId?: string }) {
    const { data } = await api.post<AuthApiResponse>(HRMS_ENDPOINTS.auth.register, payload);
    return data;
  },
  async login(payload: { email: string; password: string }) {
    const { data } = await api.post<AuthApiResponse>(HRMS_ENDPOINTS.auth.login, payload);
    return data;
  },
  async me() {
    const { data } = await api.get<AuthApiResponse>(HRMS_ENDPOINTS.auth.me);
    return data;
  },
  async listEmployees() {
    const { data } = await api.get<EmployeeApiResponse[]>(HRMS_ENDPOINTS.employees.list);
    return data;
  },
  async createEmployee(payload: Omit<EmployeeApiResponse, 'id'>) {
    const { data } = await api.post<EmployeeApiResponse>(HRMS_ENDPOINTS.employees.create, payload);
    return data;
  },
  async deleteEmployee(id: string) {
    await api.delete(HRMS_ENDPOINTS.employees.remove.replace(':id', id));
  },
  async listDepartments() {
    const { data } = await api.get<DepartmentApiResponse[]>(HRMS_ENDPOINTS.departments.list);
    return data;
  },
  async createDepartment(payload: Omit<DepartmentApiResponse, 'id'>) {
    const { data } = await api.post<DepartmentApiResponse>(HRMS_ENDPOINTS.departments.create, payload);
    return data;
  },
  async deleteDepartment(id: string) {
    await api.delete(HRMS_ENDPOINTS.departments.remove.replace(':id', id));
  },
  async listPayroll() {
    const { data } = await api.get<PayrollApiResponse[]>(HRMS_ENDPOINTS.payroll.slips);
    return data;
  },
  async createPayroll(payload: Omit<PayrollApiResponse, 'id' | 'createdAt' | 'netSalary'>) {
    const { data } = await api.post<PayrollApiResponse>(HRMS_ENDPOINTS.payroll.run, payload);
    return data;
  },
  async listLeaves() {
    const { data } = await api.get<LeaveApiResponse[]>(HRMS_ENDPOINTS.leave.list);
    return data;
  },
  async createLeave(payload: { employeeId: string; employeeName: string; leaveType: LeaveRequest['leaveType']; reason: string; startDate: string; endDate: string }) {
    const { data } = await api.post<LeaveApiResponse>(HRMS_ENDPOINTS.leave.create, payload);
    return data;
  },
  async resolveLeave(id: string, payload: { status: LeaveStatus; decidedBy?: string }) {
    const { data } = await api.patch<LeaveApiResponse>(HRMS_ENDPOINTS.leave.resolve.replace(':id', id), payload);
    return data;
  },
  async listAttendance() {
    const { data } = await api.get<AttendanceApiResponse[]>(HRMS_ENDPOINTS.attendance.list);
    return data;
  },
  async createAttendance(payload: { employeeId: string; employeeName: string; attendanceDate: string; checkInTime?: string; checkOutTime?: string; status: AttendanceStatus; mode: AttendanceRecord['mode']; notes?: string }) {
    const { data } = await api.post<AttendanceApiResponse>(HRMS_ENDPOINTS.attendance.create, payload);
    return data;
  },
};

export const normalizeEmployee = (item: EmployeeApiResponse): Employee => ({
  id: item.id,
  employeeId: item.employeeId,
  fullName: item.fullName,
  email: item.email,
  phone: item.phone,
  departmentId: item.departmentId,
  position: item.position,
  contractType: item.contractType as Employee['contractType'],
  status: item.status as EmploymentStatus,
  manager: item.manager,
  salary: Number(item.salary),
  joinDate: item.joinDate,
});

export const normalizeDepartment = (item: DepartmentApiResponse): Department => ({
  id: item.id,
  name: item.name,
  manager: item.manager,
  location: item.location,
  budget: Number(item.budget),
  headcount: item.headcount,
  status: item.status as Department['status'],
});

export const normalizeAttendance = (item: AttendanceApiResponse): AttendanceRecord => ({
  id: item.id,
  employeeId: item.employeeId,
  employeeName: item.employeeName,
  departmentId: '',
  date: item.attendanceDate,
  checkIn: item.checkInTime ?? '',
  checkOut: item.checkOutTime ?? '',
  status: (item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()) as AttendanceStatus,
  mode: item.mode,
});

export const normalizeLeave = (item: LeaveApiResponse, departmentId = '', approver = 'HR Manager'): LeaveRequest => ({
  id: item.id,
  employeeId: item.employeeId,
  employeeName: item.employeeName,
  departmentId,
  leaveType: item.leaveType,
  from: item.startDate,
  to: item.endDate,
  reason: item.reason,
  status: (item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()) as LeaveStatus,
  approver: item.decidedBy ?? approver,
  requestedAt: item.createdAt,
});

export const toPayrollRuns = (items: PayrollApiResponse[]): PayrollRun[] => {
  const grouped = new Map<string, PayrollSlip[]>();

  items.forEach((item) => {
    const slip: PayrollSlip = {
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      departmentId: '',
      grossSalary: Number(item.baseSalary),
      bonus: Number(item.bonus),
      deductions: Number(item.deductions),
      netSalary: Number(item.netSalary),
      status: item.status === 'DRAFT' ? 'Draft' : 'Processed',
    };

    const bucket = grouped.get(item.payMonth) ?? [];
    bucket.push(slip);
    grouped.set(item.payMonth, bucket);
  });

  return Array.from(grouped.entries())
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([month, slips], index) => ({
      id: `payroll-${index}-${month}`,
      month,
      generatedAt: new Date().toISOString(),
      totalGross: slips.reduce((sum, slip) => sum + slip.grossSalary, 0),
      totalBonus: slips.reduce((sum, slip) => sum + slip.bonus, 0),
      totalDeductions: slips.reduce((sum, slip) => sum + slip.deductions, 0),
      totalNet: slips.reduce((sum, slip) => sum + slip.netSalary, 0),
      slips,
    }));
};

export type {
  AuthApiResponse,
  AttendanceApiResponse,
  DepartmentApiResponse,
  EmployeeApiResponse,
  LeaveApiResponse,
  PayrollApiResponse,
};
