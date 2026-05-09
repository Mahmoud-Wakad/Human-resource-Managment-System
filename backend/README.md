# HRMS Backend Scaffold

This folder contains the Spring Boot and Spring Cloud project skeleton required by the faculty proposal.

## Modules

- `services/auth-service`
- `services/employee-service`
- `services/department-service`
- `services/payroll-service`
- `services/leave-attendance-service`
- `services/api-gateway`
- `services/service-discovery`
- `services/config-server`

## How to run

### Docker Compose

From the `backend` folder:

```powershell
docker compose up --build
```

### Run one service manually

If you have Java 21 and Maven installed, open a terminal in a service folder and run:

```powershell
mvn spring-boot:run
```

Example:

```powershell
cd services/auth-service
mvn spring-boot:run
```

### Frontend

From the repository root:

```powershell
pnpm install
pnpm dev
```
