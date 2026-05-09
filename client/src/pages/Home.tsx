export default function Home() {
  return (
    <div className="min-h-screen bg-[#07111f] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">HRMS Project</p>
        <h1 className="mt-4 text-4xl font-semibold">Human Resources Management System</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          This frontend now represents the Spring Boot and Spring Cloud HRMS proposal with authentication,
          employee management, departments, payroll, leave workflow, attendance tracking, and the required
          documentation set.
        </p>
      </div>
    </div>
  );
}
