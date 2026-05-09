# syntax=docker/dockerfile:1.7
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY services/auth-service/pom.xml services/auth-service/pom.xml
COPY services/employee-service/pom.xml services/employee-service/pom.xml
COPY services/department-service/pom.xml services/department-service/pom.xml
COPY services/payroll-service/pom.xml services/payroll-service/pom.xml
COPY services/leave-attendance-service/pom.xml services/leave-attendance-service/pom.xml
COPY services/api-gateway/pom.xml services/api-gateway/pom.xml
COPY services/service-discovery/pom.xml services/service-discovery/pom.xml
COPY services/config-server/pom.xml services/config-server/pom.xml
RUN --mount=type=cache,id=hrms-m2-cache,target=/root/.m2,sharing=locked \
    mvn -B -ntp \
    -Dmaven.repo.local=/root/.m2/repository \
    -Dmaven.wagon.http.retryHandler.count=10 \
    -Dmaven.wagon.http.useCompression=false \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=25 \
    -pl services/department-service -am dependency:go-offline
COPY . .
RUN --mount=type=cache,id=hrms-m2-cache,target=/root/.m2,sharing=locked \
    mvn -B -ntp \
    -Dmaven.repo.local=/root/.m2/repository \
    -Dmaven.wagon.http.retryHandler.count=10 \
    -Dmaven.wagon.http.useCompression=false \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=25 \
    -pl services/department-service -am package -DskipTests

FROM maven:3.9.9-eclipse-temurin-21
WORKDIR /app
COPY --from=build /workspace/services/department-service/target/department-service-1.0.0.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
