import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  BadgeCheck,
  BookOpenText,
  Building2,
  Clock3,
  Download,
  Fingerprint,
  HandCoins,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  MapPin,
  Plus,
  Search,
  ServerCog,
  Settings2,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import type {
  AttendanceRecord,
  AttendanceStatus,
  ContractType,
  Department,
  Employee,
  HRMSState,
  LeaveRequest,
  LeaveStatus,
  PayrollRun,
  PayrollSlip,
  Role,
  SessionUser,
} from '@/types';
import {
  hrmsApi,
  normalizeAttendance,
  normalizeDepartment,
  normalizeEmployee,
  normalizeLeave,
  toPayrollRuns,
} from '@/api/hrmsApi';

type TabId = 'overview' | 'employees' | 'departments' | 'payroll' | 'leave' | 'attendance' | 'architecture' | 'documentation' | 'settings';
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const roles: Role[] = ['Admin', 'HR Manager', 'Department Manager', 'Employee'];
const tabs: Array<{ id: TabId; label: string; icon: typeof LayoutDashboard; minRole?: Role[] }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users, minRole: ['Admin', 'HR Manager'] },
  { id: 'departments', label: 'Departments', icon: Building2, minRole: ['Admin', 'HR Manager'] },
  { id: 'payroll', label: 'Payroll', icon: HandCoins, minRole: ['Admin', 'HR Manager'] },
  { id: 'leave', label: 'Leave', icon: Clock3 },
  { id: 'attendance', label: 'Attendance', icon: Clock3 },
  { id: 'architecture', label: 'Architecture', icon: ServerCog },
  { id: 'documentation', label: 'SRS', icon: BookOpenText },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

const seed = (): { state: HRMSState; session: SessionUser } => ({
  state: {
    users: [
      { id: 'u1', fullName: 'Amina Hassan', email: 'admin@hrms.local', password: 'Admin@12345', role: 'Admin', departmentId: 'd2', employeeId: 'e1' },
      { id: 'u2', fullName: 'Omar Nabil', email: 'hr@hrms.local', password: 'Hr@12345', role: 'HR Manager', departmentId: 'd2', employeeId: 'e2' },
      { id: 'u3', fullName: 'Mona Adel', email: 'manager@hrms.local', password: 'Manager@12345', role: 'Department Manager', departmentId: 'd3', employeeId: 'e3' },
      { id: 'u4', fullName: 'Salma Ibrahim', email: 'employee@hrms.local', password: 'Employee@12345', role: 'Employee', departmentId: 'd3', employeeId: 'e4' },
    ],
    departments: [
      { id: 'd1', name: 'Finance', manager: 'Amina Hassan', location: 'Main Campus', budget: 180000, headcount: 3, status: 'Active' },
      { id: 'd2', name: 'Human Resources', manager: 'Omar Nabil', location: 'HQ - Floor 2', budget: 120000, headcount: 4, status: 'Active' },
      { id: 'd3', name: 'Information Technology', manager: 'Mona Adel', location: 'Tech Hub', budget: 240000, headcount: 5, status: 'Active' },
    ],
    employees: [
      { id: 'e1', employeeId: 'EMP-1001', fullName: 'Amina Hassan', email: 'admin@hrms.local', phone: '+20 100 111 2221', departmentId: 'd2', position: 'Chief HR Officer', contractType: 'Permanent', status: 'Active', manager: 'University Board', salary: 18000, joinDate: '2023-09-18' },
      { id: 'e2', employeeId: 'EMP-1002', fullName: 'Omar Nabil', email: 'hr@hrms.local', phone: '+20 100 111 2222', departmentId: 'd2', position: 'HR Manager', contractType: 'Permanent', status: 'Active', manager: 'Amina Hassan', salary: 15000, joinDate: '2024-01-10' },
      { id: 'e3', employeeId: 'EMP-1003', fullName: 'Mona Adel', email: 'manager@hrms.local', phone: '+20 100 111 2223', departmentId: 'd3', position: 'Department Manager', contractType: 'Permanent', status: 'Active', manager: 'Amina Hassan', salary: 16000, joinDate: '2024-04-12' },
      { id: 'e4', employeeId: 'EMP-1004', fullName: 'Salma Ibrahim', email: 'employee@hrms.local', phone: '+20 100 111 2224', departmentId: 'd3', position: 'Software Engineer', contractType: 'Permanent', status: 'Active', manager: 'Mona Adel', salary: 12000, joinDate: '2024-08-01' },
    ],
    leaves: [
      { id: 'l1', employeeId: 'e4', employeeName: 'Salma Ibrahim', departmentId: 'd3', leaveType: 'Annual', from: '2026-04-21', to: '2026-04-24', reason: 'Family travel', status: 'Pending', approver: 'Mona Adel', requestedAt: '2026-04-15T09:30:00.000Z' },
    ],
    attendance: [
      { id: 'a1', employeeId: 'e1', employeeName: 'Amina Hassan', departmentId: 'd2', date: '2026-04-17', checkIn: '08:14', checkOut: '16:42', status: 'Present', mode: 'On-site' },
      { id: 'a2', employeeId: 'e2', employeeName: 'Omar Nabil', departmentId: 'd2', date: '2026-04-17', checkIn: '08:22', checkOut: '16:35', status: 'Late', mode: 'On-site' },
      { id: 'a3', employeeId: 'e3', employeeName: 'Mona Adel', departmentId: 'd3', date: '2026-04-17', checkIn: '08:03', checkOut: '17:00', status: 'Remote', mode: 'Remote' },
    ],
    payrollRuns: [
      {
        id: 'p1',
        month: '2026-03',
        generatedAt: '2026-03-31T10:00:00.000Z',
        totalGross: 51000,
        totalBonus: 3200,
        totalDeductions: 1700,
        totalNet: 52500,
        slips: [
          { employeeId: 'e1', employeeName: 'Amina Hassan', departmentId: 'd2', grossSalary: 18000, bonus: 1200, deductions: 300, netSalary: 18900, status: 'Processed' },
          { employeeId: 'e2', employeeName: 'Omar Nabil', departmentId: 'd2', grossSalary: 15000, bonus: 1000, deductions: 500, netSalary: 15500, status: 'Processed' },
          { employeeId: 'e3', employeeName: 'Mona Adel', departmentId: 'd3', grossSalary: 18000, bonus: 1000, deductions: 900, netSalary: 18100, status: 'Processed' },
        ],
      },
    ],
  },
  session: { id: 'u1', fullName: 'Amina Hassan', email: 'admin@hrms.local', role: 'Admin', departmentId: 'd2', employeeId: 'e1' },
});

const fmt = (value: number) => money.format(value);
const today = () => new Date().toISOString().slice(0, 10);
const monthKey = () => new Date().toISOString().slice(0, 7);
const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">{children}</span>;
}

function AuthScreen({ onLogin, onRegister, loading, notice }: { onLogin: (email: string, password: string) => Promise<void>; onRegister: (payload: { fullName: string; email: string; password: string; role: Role }) => Promise<void>; loading: boolean; notice: string }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Employee');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'login') await onLogin(email, password);
    else await onRegister({ fullName, email, password, role });
  };

  return (
    <div className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <Fingerprint className="h-4 w-4 text-emerald-300" /> Spring Boot HRMS project
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-tight">Human Resources Management System</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">A faculty-ready HRMS redesign with role-based access, employee and department modules, payroll, leave and attendance, Spring Cloud architecture notes, and SRS documentation.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {['JWT auth', 'Dockerized', 'Microservices'].map((item) => <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4">{item}</div>)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
          <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Login' : 'Register'}</h2>
          <p className="mt-2 text-sm text-slate-400">{notice}</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            {mode === 'register' && <><input value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" /><select value={role} onChange={(event) => setRole(event.target.value as Role)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none">{roles.map((item) => <option key={item}>{item}</option>)}</select></>}
            <input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" minLength={8} placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
            <button disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white">{loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
          </form>
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-4 text-sm text-sky-300">{mode === 'login' ? 'Need an account? Register' : 'Back to login'}</button>
          <div className="mt-6 grid gap-2 text-sm text-slate-300">
            <p>Admin: admin@hrms.local / Admin@12345</p>
            <p>HR: hr@hrms.local / Hr@12345</p>
            <p>Manager: manager@hrms.local / Manager@12345</p>
            <p>Employee: employee@hrms.local / Employee@12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function App() {
  const initial = useMemo(() => seed(), []);
  const [state, setState] = useState<HRMSState>(() => initial.state);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [notice, setNotice] = useState('Ready for the HRMS demo.');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [departmentForm, setDepartmentForm] = useState({ name: '', manager: '', location: '', budget: '100000' });
  const [employeeForm, setEmployeeForm] = useState({ fullName: '', email: '', phone: '', departmentId: 'd3', position: '', contractType: 'Permanent' as ContractType, salary: '12000', manager: '' });
  const [leaveForm, setLeaveForm] = useState({ employeeId: 'e4', leaveType: 'Annual' as LeaveRequest['leaveType'], from: today(), to: today(), reason: '' });
  const [attendanceForm, setAttendanceForm] = useState({ employeeId: 'e4', date: today(), checkIn: '08:00', checkOut: '16:00', status: 'Present' as AttendanceStatus, mode: 'On-site' as AttendanceRecord['mode'] });
  const [payrollMonth, setPayrollMonth] = useState(monthKey());

  const departmentById = useMemo(() => new Map(state.departments.map((department) => [department.id, department])), [state.departments]);
  const employeeById = useMemo(() => new Map(state.employees.map((employee) => [employee.id, employee])), [state.employees]);
  const isAdminLike = session ? ['Admin', 'HR Manager'].includes(session.role) : false;
  const canApprove = session ? ['Admin', 'HR Manager', 'Department Manager'].includes(session.role) : false;
  const monthAttendance = state.attendance.filter((record) => record.date.startsWith(monthKey()));
  const attendanceRate = monthAttendance.length ? Math.round((monthAttendance.filter((record) => record.status === 'Present' || record.status === 'Remote').length / monthAttendance.length) * 100) : 0;

  useEffect(() => {
    const bootstrap = hrmsApi.bootstrap();
    if (!bootstrap.session) {
      return;
    }

    setSession(bootstrap.session);
    void hydrateFromBackend(bootstrap.session);
  }, []);

  const hydrateFromBackend = async (currentSession: SessionUser) => {
    try {
      const [employeesApi, departmentsApi, leavesApi, attendanceApi, payrollApi] = await Promise.all([
        hrmsApi.listEmployees(),
        hrmsApi.listDepartments(),
        hrmsApi.listLeaves(),
        hrmsApi.listAttendance(),
        hrmsApi.listPayroll(),
      ]);

      setState((previous) => {
        const employees = employeesApi.length ? employeesApi.map(normalizeEmployee) : previous.employees;
        const departments = departmentsApi.length ? departmentsApi.map(normalizeDepartment) : previous.departments;
        const employeeByIdLookup = new Map(employees.map((employee) => [employee.id, employee]));
        const departmentByIdLookup = new Map(departments.map((department) => [department.id, department]));

        const leaves = leavesApi.length
          ? leavesApi.map((leave) => {
              const employee = employeeByIdLookup.get(leave.employeeId);
              const departmentId = employee?.departmentId ?? '';
              return normalizeLeave(leave, departmentId, departmentByIdLookup.get(departmentId)?.manager ?? currentSession.role);
            })
          : previous.leaves;

        const attendance = attendanceApi.length
          ? attendanceApi.map((record) => {
              const employee = employeeByIdLookup.get(record.employeeId);
              return {
                ...normalizeAttendance(record),
                departmentId: employee?.departmentId ?? '',
              };
            })
          : previous.attendance;

        const payrollRuns = payrollApi.length ? toPayrollRuns(payrollApi) : previous.payrollRuns;

        return {
          ...previous,
          employees,
          departments,
          leaves,
          attendance,
          payrollRuns,
        };
      });

      notify('Backend data loaded from Spring services.');
    } catch {
      notify('Backend is offline, so the seeded demo data is still active.');
    }
  };

  const notify = (message: string) => setNotice(message);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const auth = await hrmsApi.login({ email, password });
      const nextSession: SessionUser = {
        id: auth.employeeId ?? auth.email,
        fullName: auth.fullName,
        email: auth.email,
        role: auth.role,
        departmentId: auth.departmentId,
        employeeId: auth.employeeId,
      };
      hrmsApi.saveSession(nextSession, auth.token);
      setSession(nextSession);
      setActiveTab('overview');
      await hydrateFromBackend(nextSession);
      notify(`Welcome back, ${auth.fullName}.`);
    } catch {
      const user = initial.state.users.find((account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password);
      if (!user) {
        notify('Invalid credentials. Use one of the seeded accounts or start the backend stack first.');
        setLoading(false);
        return;
      }
      const fallbackSession: SessionUser = { id: user.id, fullName: user.fullName, email: user.email, role: user.role, departmentId: user.departmentId, employeeId: user.employeeId };
      setSession(fallbackSession);
      hrmsApi.saveSession(fallbackSession, null);
      setActiveTab('overview');
      notify(`Backend unavailable, so the local demo signed you in as ${user.fullName}.`);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { fullName: string; email: string; password: string; role: Role }) => {
    setLoading(true);
    try {
      const auth = await hrmsApi.register({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        departmentId: payload.role === 'Department Manager' ? 'd3' : 'd2',
      });
      const nextSession: SessionUser = {
        id: auth.employeeId ?? auth.email,
        fullName: auth.fullName,
        email: auth.email,
        role: auth.role,
        departmentId: auth.departmentId,
        employeeId: auth.employeeId,
      };
      hrmsApi.saveSession(nextSession, auth.token);
      setSession(nextSession);
      setActiveTab('overview');
      await hydrateFromBackend(nextSession);
      notify('Account created in the Spring auth service.');
    } catch {
      if (initial.state.users.some((account) => account.email.toLowerCase() === payload.email.toLowerCase())) {
        notify('That email already exists in the demo data.');
        return;
      }
      const nextUser = {
        id: createId('u'),
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        departmentId: payload.role === 'Department Manager' ? 'd3' : 'd2',
        employeeId: payload.role === 'Employee' ? createId('e') : undefined,
      };
      setState((previous) => ({ ...previous, users: [nextUser, ...previous.users] }));
      const fallbackSession: SessionUser = { id: nextUser.id, fullName: nextUser.fullName, email: nextUser.email, role: nextUser.role, departmentId: nextUser.departmentId, employeeId: nextUser.employeeId };
      setSession(fallbackSession);
      hrmsApi.saveSession(fallbackSession, null);
      setActiveTab('overview');
      notify('Backend unavailable, so the local demo created the account instead.');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAdminLike) return notify('Only Admin and HR Manager can add employees.');
    try {
      const employeeId = `EMP-${1000 + state.employees.length + 1}`;
      const created = await hrmsApi.createEmployee({
        employeeId,
        fullName: employeeForm.fullName,
        email: employeeForm.email,
        phone: employeeForm.phone,
        departmentId: employeeForm.departmentId,
        position: employeeForm.position,
        contractType: employeeForm.contractType,
        status: 'Active',
        manager: employeeForm.manager,
        salary: Number(employeeForm.salary),
        joinDate: today(),
      });
      setState((previous) => ({ ...previous, employees: [normalizeEmployee(created), ...previous.employees] }));
      setEmployeeForm({ fullName: '', email: '', phone: '', departmentId: employeeForm.departmentId, position: '', contractType: 'Permanent', salary: '12000', manager: '' });
      notify(`Employee ${created.fullName} added through the backend.`);
    } catch {
      const employee: Employee = {
        id: createId('e'),
        employeeId: `EMP-${1000 + state.employees.length + 1}`,
        fullName: employeeForm.fullName,
        email: employeeForm.email,
        phone: employeeForm.phone,
        departmentId: employeeForm.departmentId,
        position: employeeForm.position,
        contractType: employeeForm.contractType,
        status: 'Active',
        manager: employeeForm.manager,
        salary: Number(employeeForm.salary),
        joinDate: today(),
      };
      setState((previous) => ({ ...previous, employees: [employee, ...previous.employees] }));
      setEmployeeForm({ fullName: '', email: '', phone: '', departmentId: employeeForm.departmentId, position: '', contractType: 'Permanent', salary: '12000', manager: '' });
      notify(`Backend unavailable, so employee ${employee.fullName} was added locally.`);
    }
  };

  const addDepartment = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAdminLike) return notify('Only Admin and HR Manager can add departments.');
    try {
      const created = await hrmsApi.createDepartment({
        name: departmentForm.name,
        manager: departmentForm.manager,
        location: departmentForm.location,
        budget: Number(departmentForm.budget),
        headcount: 0,
        status: 'Planning',
      });
      setState((previous) => ({ ...previous, departments: [normalizeDepartment(created), ...previous.departments] }));
      setDepartmentForm({ name: '', manager: '', location: '', budget: '100000' });
      notify(`Department ${created.name} created through the backend.`);
    } catch {
      const department: Department = { id: createId('d'), name: departmentForm.name, manager: departmentForm.manager, location: departmentForm.location, budget: Number(departmentForm.budget), headcount: 0, status: 'Planning' };
      setState((previous) => ({ ...previous, departments: [department, ...previous.departments] }));
      setDepartmentForm({ name: '', manager: '', location: '', budget: '100000' });
      notify(`Backend unavailable, so department ${department.name} was created locally.`);
    }
  };

  const submitLeave = async (event: FormEvent) => {
    event.preventDefault();
    const employee = employeeById.get(leaveForm.employeeId);
    if (!employee) return notify('Select a valid employee first.');
    try {
      const created = await hrmsApi.createLeave({
        employeeId: employee.id,
        employeeName: employee.fullName,
        leaveType: leaveForm.leaveType,
        reason: leaveForm.reason,
        startDate: leaveForm.from,
        endDate: leaveForm.to,
      });
      const request: LeaveRequest = normalizeLeave(created, employee.departmentId, departmentById.get(employee.departmentId)?.manager ?? 'HR Manager');
      setState((previous) => ({ ...previous, leaves: [request, ...previous.leaves] }));
      setLeaveForm((previous) => ({ ...previous, reason: '', from: today(), to: today() }));
      notify('Leave request submitted to the backend.');
    } catch {
      const request: LeaveRequest = { id: createId('l'), employeeId: employee.id, employeeName: employee.fullName, departmentId: employee.departmentId, leaveType: leaveForm.leaveType, from: leaveForm.from, to: leaveForm.to, reason: leaveForm.reason, status: 'Pending', approver: departmentById.get(employee.departmentId)?.manager ?? 'HR Manager', requestedAt: new Date().toISOString() };
      setState((previous) => ({ ...previous, leaves: [request, ...previous.leaves] }));
      setLeaveForm((previous) => ({ ...previous, reason: '', from: today(), to: today() }));
      notify('Backend unavailable, so the leave request was stored locally.');
    }
  };

  const resolveLeave = async (id: string, status: LeaveStatus) => {
    if (!canApprove) return notify('Your role cannot approve leave requests.');
    try {
      const updated = await hrmsApi.resolveLeave(id, { status, decidedBy: session?.fullName });
      setState((previous) => ({
        ...previous,
        leaves: previous.leaves.map((leave) => {
          if (leave.id !== id) return leave;
          return normalizeLeave(updated, leave.departmentId, session?.fullName ?? leave.approver);
        }),
      }));
      notify(`Leave request marked ${status.toLowerCase()} in the backend.`);
    } catch {
      setState((previous) => ({ ...previous, leaves: previous.leaves.map((leave) => (leave.id === id ? { ...leave, status } : leave)) }));
      notify(`Backend unavailable, so the leave request was marked ${status.toLowerCase()} locally.`);
    }
  };

  const addAttendance = async (event: FormEvent) => {
    event.preventDefault();
    const employee = employeeById.get(attendanceForm.employeeId);
    if (!employee) return notify('Select a valid employee first.');
    try {
      const created = await hrmsApi.createAttendance({
        employeeId: employee.id,
        employeeName: employee.fullName,
        attendanceDate: attendanceForm.date,
        checkInTime: attendanceForm.checkIn,
        checkOutTime: attendanceForm.checkOut,
        status: attendanceForm.status,
        mode: attendanceForm.mode,
        notes: `${attendanceForm.mode} check-in`,
      });
      const record: AttendanceRecord = {
        ...normalizeAttendance(created),
        departmentId: employee.departmentId,
      };
      setState((previous) => ({ ...previous, attendance: [record, ...previous.attendance] }));
      notify(`Attendance saved for ${employee.fullName} in the backend.`);
    } catch {
      const record: AttendanceRecord = { id: createId('a'), employeeId: employee.id, employeeName: employee.fullName, departmentId: employee.departmentId, date: attendanceForm.date, checkIn: attendanceForm.checkIn, checkOut: attendanceForm.checkOut, status: attendanceForm.status, mode: attendanceForm.mode };
      setState((previous) => ({ ...previous, attendance: [record, ...previous.attendance] }));
      notify(`Backend unavailable, so attendance for ${employee.fullName} was stored locally.`);
    }
  };

  const generatePayroll = async () => {
    if (!isAdminLike) return notify('Payroll generation is limited to Admin and HR Manager.');
    try {
      const createdRecords = await Promise.all(
        state.employees.map((employee) =>
          hrmsApi.createPayroll({
            employeeId: employee.id,
            employeeName: employee.fullName,
            payMonth: payrollMonth,
            baseSalary: employee.salary,
            bonus: Math.round(employee.salary * (employee.position.toLowerCase().includes('manager') ? 0.08 : 0.04)),
            deductions: state.attendance.filter((record) => record.employeeId === employee.id && record.status === 'Late').length * 150,
            status: 'PROCESSED',
          }),
        ),
      );
      setState((previous) => ({ ...previous, payrollRuns: toPayrollRuns(createdRecords).concat(previous.payrollRuns) }));
      notify(`Payroll posted to the backend for ${payrollMonth}.`);
    } catch {
      const slips: PayrollSlip[] = state.employees.map((employee) => {
        const bonus = Math.round(employee.salary * (employee.position.toLowerCase().includes('manager') ? 0.08 : 0.04));
        const deductions = state.attendance.filter((record) => record.employeeId === employee.id && record.status === 'Late').length * 150;
        return { employeeId: employee.id, employeeName: employee.fullName, departmentId: employee.departmentId, grossSalary: employee.salary, bonus, deductions, netSalary: employee.salary + bonus - deductions, status: 'Processed' };
      });
      const payroll: PayrollRun = { id: createId('p'), month: payrollMonth, generatedAt: new Date().toISOString(), totalGross: slips.reduce((sum, item) => sum + item.grossSalary, 0), totalBonus: slips.reduce((sum, item) => sum + item.bonus, 0), totalDeductions: slips.reduce((sum, item) => sum + item.deductions, 0), totalNet: slips.reduce((sum, item) => sum + item.netSalary, 0), slips };
      setState((previous) => ({ ...previous, payrollRuns: [payroll, ...previous.payrollRuns] }));
      notify(`Backend unavailable, so payroll was generated locally for ${payrollMonth}.`);
    }
  };

  const exportSnapshot = () => {
    const blob = new Blob([JSON.stringify({ session, state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hrms-snapshot-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify('Project snapshot exported.');
  };

  const resetDemo = () => {
    const next = seed();
    setState(next.state);
    setSession(null);
    hrmsApi.clearSession();
    setActiveTab('overview');
    notify('Demo data restored.');
  };

  const allowed = (tab: TabId) => {
    const meta = tabs.find((item) => item.id === tab);
    if (!meta?.minRole || !session) return true;
    return meta.minRole.some((role) => roles.indexOf(session.role) >= roles.indexOf(role));
  };

  const filteredEmployees = state.employees.filter((employee) => [employee.fullName, employee.email, employee.position].join(' ').toLowerCase().includes(search.toLowerCase()));
  const visibleLeaves = session?.role === 'Employee' ? state.leaves.filter((leave) => leave.employeeId === session.employeeId) : state.leaves;
  const visibleAttendance = session?.role === 'Employee' ? state.attendance.filter((record) => record.employeeId === session.employeeId) : state.attendance;
  const currentPayroll = state.payrollRuns[0];
  if (!session) {
    return <AuthScreen onLogin={login} onRegister={register} loading={loading} notice={notice} />;
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 xl:grid-cols-[300px_1fr] xl:px-6">
        <aside className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 p-3"><ServerCog className="h-5 w-5" /></div>
            <div>
              <p className="text-lg font-semibold">HRMS Suite</p>
              <p className="text-xs text-slate-400">Faculty project edition</p>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const canOpen = allowed(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!canOpen) return notify('This module is hidden by role-based access control.');
                    setActiveTab(tab.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${active ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                >
                  <span className="flex items-center gap-3">
                    <tab.icon className={`${active ? 'text-emerald-300' : 'text-slate-400'} h-4 w-4`} />
                    {tab.label}
                  </span>
                  {!canOpen && <LockKeyhole className="h-4 w-4 text-slate-500" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Signed in as</p>
            <p className="mt-1 font-medium">{session.fullName}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Pill>{session.role}</Pill>
              <Pill>{departmentById.get(session.departmentId ?? '')?.name ?? 'Unassigned'}</Pill>
            </div>
          </div>

          <button onClick={() => { setSession(null); hrmsApi.clearSession(); }} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <main className="space-y-6">
          <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1">Spring Boot</span>
                  <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1">Spring Cloud</span>
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1">Docker</span>
                  <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1">AOP</span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label ?? 'Overview'}</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-300">This repository has been reshaped from an expense tracker into an HRMS project that matches the faculty proposal: authentication, five HR modules, role-based access, Spring Cloud architecture, Docker, and full documentation.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm">
                <p className="text-slate-400">Today</p>
                <p>{formatDate(today())}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200">{notice}</div>
          </header>

          {activeTab === 'overview' && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[{ label: 'Employees', value: state.employees.length, hint: 'HR profiles managed' }, { label: 'Departments', value: state.departments.length, hint: 'Org structure' }, { label: 'Pending leaves', value: state.leaves.filter((leave) => leave.status === 'Pending').length, hint: 'Awaiting approval' }, { label: 'Attendance rate', value: `${attendanceRate}%`, hint: 'This month' }].map((card) => (
                <div key={card.label} className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                  <p className="mt-2 text-sm text-slate-300">{card.hint}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold">Proposal coverage</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {['Auth Service', 'Employee Service', 'Department Service', 'Payroll Service', 'Leave + Attendance', 'API Gateway + Config'].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm">{item}</div>
                  ))}
                </div>
              </section>
              <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold">Faculty deliverables</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-3"><BadgeCheck className="h-4 w-4 text-emerald-300" /> SRS document</div>
                  <div className="flex items-center gap-3"><BadgeCheck className="h-4 w-4 text-emerald-300" /> Use case, class, sequence, activity diagrams</div>
                  <div className="flex items-center gap-3"><BadgeCheck className="h-4 w-4 text-emerald-300" /> Dockerized deployment plan</div>
                  <div className="flex items-center gap-3"><BadgeCheck className="h-4 w-4 text-emerald-300" /> Role-based API authorization</div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'employees' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Employee service</h2>
              {isAdminLike ? (
                <form onSubmit={addEmployee} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <input value={employeeForm.fullName} onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })} placeholder="Full name" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <input value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <input value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <select value={employeeForm.departmentId} onChange={(e) => setEmployeeForm({ ...employeeForm, departmentId: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none">{state.departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select>
                  <input value={employeeForm.position} onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })} placeholder="Position" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <input value={employeeForm.manager} onChange={(e) => setEmployeeForm({ ...employeeForm, manager: e.target.value })} placeholder="Manager" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <input value={employeeForm.salary} onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })} type="number" placeholder="Salary" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <button className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white md:col-span-2 xl:col-span-3">Add employee</button>
                </form>
              ) : (
                <p className="mt-3 text-sm text-slate-300">Read-only access for this role.</p>
              )}
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees" className="w-full bg-transparent outline-none" />
              </div>
              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.2em] text-slate-400"><tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Position</th><th className="px-4 py-3">Salary</th></tr></thead>
                  <tbody className="divide-y divide-white/10">{filteredEmployees.map((employee) => (<tr key={employee.id}><td className="px-4 py-3 text-white">{employee.fullName}<div className="text-xs text-slate-400">{employee.employeeId}</div></td><td className="px-4 py-3">{departmentById.get(employee.departmentId)?.name ?? 'Unknown'}</td><td className="px-4 py-3">{employee.position}</td><td className="px-4 py-3">{fmt(employee.salary)}</td></tr>))}</tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'departments' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Department service</h2>
              {isAdminLike ? (
                <form onSubmit={addDepartment} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <input value={departmentForm.name} onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} placeholder="Department name" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <input value={departmentForm.manager} onChange={(e) => setDepartmentForm({ ...departmentForm, manager: e.target.value })} placeholder="Manager" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <input value={departmentForm.location} onChange={(e) => setDepartmentForm({ ...departmentForm, location: e.target.value })} placeholder="Location" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <input value={departmentForm.budget} onChange={(e) => setDepartmentForm({ ...departmentForm, budget: e.target.value })} type="number" placeholder="Budget" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                  <button className="rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white md:col-span-2 xl:col-span-4">Add department</button>
                </form>
              ) : (
                <p className="mt-3 text-sm text-slate-300">Read-only access for this role.</p>
              )}
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {state.departments.map((department) => (
                  <div key={department.id} className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{department.name}</h3>
                      {isAdminLike && <button onClick={() => setState((previous) => ({ ...previous, departments: previous.departments.filter((item) => item.id !== department.id) }))} className="text-rose-300"><XCircle className="h-4 w-4" /></button>}
                    </div>
                    <p className="mt-2 text-sm text-slate-300">Manager: {department.manager}</p>
                    <p className="mt-1 text-sm text-slate-300">Location: {department.location}</p>
                    <p className="mt-1 text-sm text-slate-300">Budget: {fmt(department.budget)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'payroll' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Payroll service</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <input value={payrollMonth} onChange={(e) => setPayrollMonth(e.target.value)} type="month" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                <button onClick={generatePayroll} className="rounded-2xl bg-amber-500 px-4 py-3 font-medium text-white">Generate payroll</button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">Gross: {currentPayroll ? fmt(currentPayroll.totalGross) : fmt(0)}</div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">Bonus: {currentPayroll ? fmt(currentPayroll.totalBonus) : fmt(0)}</div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">Deductions: {currentPayroll ? fmt(currentPayroll.totalDeductions) : fmt(0)}</div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">Net: {currentPayroll ? fmt(currentPayroll.totalNet) : fmt(0)}</div>
              </div>
            </section>
          )}
          {activeTab === 'leave' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Leave workflow</h2>
              <form onSubmit={submitLeave} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <select value={leaveForm.employeeId} onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none">{state.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}</select>
                <select value={leaveForm.leaveType} onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveRequest['leaveType'] })} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none"><option>Annual</option><option>Sick</option><option>Emergency</option><option>Maternity</option><option>Unpaid</option></select>
                <input value={leaveForm.from} onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })} type="date" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                <input value={leaveForm.to} onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })} type="date" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                <input value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} placeholder="Reason" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none md:col-span-2 xl:col-span-3" />
                <button className="rounded-2xl bg-rose-500 px-4 py-3 font-medium text-white">Submit leave</button>
              </form>
              <div className="mt-5 space-y-3">{visibleLeaves.map((leave) => (<div key={leave.id} className="rounded-3xl border border-white/10 bg-slate-950/30 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{leave.employeeName}</p><p className="text-sm text-slate-300">{leave.leaveType} • {formatDate(leave.from)} to {formatDate(leave.to)}</p><p className="text-sm text-slate-400">{leave.reason}</p></div><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">{leave.status}</span></div>{canApprove && leave.status === 'Pending' && (<div className="mt-3 flex gap-2"><button onClick={() => resolveLeave(leave.id, 'Approved')} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium">Approve</button><button onClick={() => resolveLeave(leave.id, 'Rejected')} className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-medium">Reject</button></div>)}</div>))}</div>
            </section>
          )}

          {activeTab === 'attendance' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Attendance tracking</h2>
              <form onSubmit={addAttendance} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <select value={attendanceForm.employeeId} onChange={(e) => setAttendanceForm({ ...attendanceForm, employeeId: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none">{state.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}</select>
                <input value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} type="date" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                <input value={attendanceForm.checkIn} onChange={(e) => setAttendanceForm({ ...attendanceForm, checkIn: e.target.value })} type="time" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                <input value={attendanceForm.checkOut} onChange={(e) => setAttendanceForm({ ...attendanceForm, checkOut: e.target.value })} type="time" className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none" />
                <select value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value as AttendanceStatus })} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none"><option>Present</option><option>Late</option><option>Absent</option><option>Remote</option></select>
                <select value={attendanceForm.mode} onChange={(e) => setAttendanceForm({ ...attendanceForm, mode: e.target.value as AttendanceRecord['mode'] })} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 outline-none xl:col-span-4"><option>On-site</option><option>Hybrid</option><option>Remote</option></select>
                <button className="rounded-2xl bg-sky-500 px-4 py-3 font-medium text-white">Save attendance</button>
              </form>
              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
                <table className="min-w-full text-sm"><thead className="bg-white/5 text-left text-xs uppercase tracking-[0.2em] text-slate-400"><tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Check-in</th><th className="px-4 py-3">Check-out</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-white/10">{visibleAttendance.map((record) => (<tr key={record.id}><td className="px-4 py-3">{record.employeeName}</td><td className="px-4 py-3">{formatDate(record.date)}</td><td className="px-4 py-3">{record.checkIn}</td><td className="px-4 py-3">{record.checkOut}</td><td className="px-4 py-3">{record.status}</td></tr>))}</tbody></table>
              </div>
            </section>
          )}

          {activeTab === 'architecture' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Spring Cloud architecture</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {['Auth Service', 'Employee Service', 'Department Service', 'Payroll Service', 'Leave + Attendance', 'Gateway, Eureka, Config'].map((item) => (<div key={item} className="rounded-3xl border border-white/10 bg-slate-950/30 p-4 text-sm">{item}</div>))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">AOP for logging, auditing, and transaction management.</div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">PostgreSQL or MySQL per service, deployed with Docker Compose.</div>
              </div>
            </section>
          )}

          {activeTab === 'documentation' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">SRS and diagrams</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4"><p className="font-semibold">SRS sections</p><p className="mt-2 text-sm text-slate-300">Introduction, overall description, functional requirements, interfaces, non-functional requirements, and appendices.</p></div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4"><p className="font-semibold">Diagram set</p><p className="mt-2 text-sm text-slate-300">Use case, class, sequence, and activity diagrams are included in the repository docs.</p></div>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Project settings</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <button onClick={exportSnapshot} className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5 text-left"><div className="flex items-center gap-3"><Download className="h-5 w-5 text-sky-300" /> Export snapshot</div></button>
                <button onClick={resetDemo} className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-left"><div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-amber-300" /> Reset demo data</div></button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
