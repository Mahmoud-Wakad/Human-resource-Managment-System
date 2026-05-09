# HRMS Microservices Project

This repository has been reshaped to match the Software Engineering 2 guidelines and the faculty proposal for a microservices-based HRMS.

## What is included

- Spring Boot REST API scaffold for five backend business services
- Spring Cloud architecture with gateway, Eureka, and config server
- Role-based HRMS frontend in React
- AOP, JWT-style auth, Docker, and JPA-based service scaffolds
- Dockerfiles for each service and Docker Compose for the stack
- SRS, architecture, proposal, and diagram documents

## Functional modules

- Auth Service
- Employee Service
- Department Service
- Payroll Service
- Leave & Attendance Service

## Supporting services

- API Gateway
- Service Discovery
- Config Server

## Run the project

### Frontend

From the repository root:

```powershell
pnpm install
pnpm dev
```

### Full backend stack with Docker

From the `backend` folder:

```powershell
docker compose up --build
```

That starts:

- Config Server on `http://localhost:8888`
- Eureka on `http://localhost:8761`
- API Gateway on `http://localhost:8080`
- Auth Service on `http://localhost:8081`
- Employee Service on `http://localhost:8082`
- Department Service on `http://localhost:8083`
- Payroll Service on `http://localhost:8084`
- Leave & Attendance Service on `http://localhost:8085`

## Notes

- The React frontend uses the HRMS demo shell and local mock state so it can be shown immediately.
- The Spring services are scaffolded as REST microservices with JPA entities, security, and AOP.
- If your machine has Java 21 and Maven installed, you can also run any service manually from its module folder.

## Documentation

- `docs/PROJECT_PROPOSAL.md`
- `docs/SRS.md`
- `docs/architecture.md`
- `docs/diagrams.md`
- `docs/OCL.md`
- `docs/DESIGN_PATTERNS.md`
- `docs/CLEAN_CODE.md`
- `docs/SUBMISSION_CHECKLIST.md`

## Software Engineering 2 Requirements Map

This section shows where each guideline is covered in the repository.

| Requirement | Where to find it |
| --- | --- |
| Spring Boot backend | `backend/services/*` and `backend/pom.xml` |
| REST APIs | `backend/services/*/src/main/java/**/*Controller*.java` |
| Frontend framework | `client/` |
| At least four functional modules | `backend/services/auth-service`, `employee-service`, `department-service`, `payroll-service`, `leave-attendance-service` |
| Roles and API authorization | `backend/services/auth-service/src/main/java/com/hrms/authservice/model/Role.java`, `backend/services/auth-service/src/main/java/com/hrms/authservice/config/SecurityConfig.java`, `backend/services/employee-service/src/main/java/com/hrms/employeeservice/config/SecurityConfig.java` |
| AOP | `backend/services/auth-service/src/main/java/com/hrms/authservice/aspect/RequestAuditAspect.java`, `backend/services/employee-service/src/main/java/com/hrms/employeeservice/aspect/ModuleAuditAspect.java` |
| Dockerized deployment | `backend/docker-compose.yml` and every service Dockerfile in `backend/services/*` |
| Microservices and Spring Cloud | `backend/pom.xml`, `backend/docker-compose.yml`, and the `service-discovery`, `api-gateway`, and `config-server` modules |
| Database | JPA entities and repository layers under each service, plus the database config in each service `application.properties` |
| Registration and authentication | `backend/services/auth-service/src/main/java/com/hrms/authservice/controller/AuthController.java` and related auth service classes |
| SRS document | `docs/SRS.md` |
| Use case diagram | `docs/diagrams.md` |
| Class diagram | `docs/diagrams.md` |
| Sequence diagram | `docs/diagrams.md` |
| Activity diagram | `docs/diagrams.md` |
| ERD | `docs/diagrams.md` |
| OCL | `docs/OCL.md` |
| Design pattern evidence | `docs/DESIGN_PATTERNS.md` |
| Clean code evidence | `docs/CLEAN_CODE.md` |

## Submission Notes

- Team size is not enforced by the codebase, so put the actual 6 to 7 member names in your cover page or final report.
- If your instructor wants a live demo, start with Docker Compose from `backend/` and show the login flow from `client/`.
"# Human-resource-Managment-System" 
