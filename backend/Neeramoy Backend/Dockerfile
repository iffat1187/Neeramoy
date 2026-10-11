# ==============================================================================
# Multi-Stage Production Dockerfile for Neeramoy Backend
# Build Stage: Eclipse Temurin Java 25 JDK
# Runtime Stage: Eclipse Temurin Java 25 JRE
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Application with Maven Wrapper & Java 25
# ------------------------------------------------------------------------------
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

# Copy Maven Wrapper scripts and configuration first for layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Normalize line endings and ensure execute permission
RUN sed -i 's/\r$//' ./mvnw && chmod +x ./mvnw

# Pre-fetch project dependencies offline
RUN ./mvnw dependency:go-offline -B || true

# Copy project source code
COPY src ./src

# Package production application artifact skipping unit tests
RUN ./mvnw clean package -DskipTests -B

# Dynamically find the repackaged Spring Boot executable JAR without assuming a fixed filename
RUN find target/ -maxdepth 1 -name "*.jar" ! -name "*.original" -exec cp {} app.jar \;

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime with Java 25 JRE
# ------------------------------------------------------------------------------
FROM eclipse-temurin:25-jre

WORKDIR /app

# Create unprivileged system user for container security
RUN groupadd -r spring && useradd -r -g spring spring

# Copy compiled JAR from builder stage
COPY --from=builder --chown=spring:spring /app/app.jar app.jar

# Switch to unprivileged user
USER spring:spring

# Render compatibility: Default to port 10000, overridable by Render's PORT environment variable
ENV PORT=10000
EXPOSE ${PORT}

# Run the Spring Boot application with container-aware JVM settings and PORT binding
ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT} -Djava.security.egd=file:/dev/./urandom -XX:+ExitOnOutOfMemoryError -jar app.jar"]
