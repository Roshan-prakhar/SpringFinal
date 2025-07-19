# Use OpenJDK base image with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml and download dependencies first (use Docker layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the project files
COPY . .

# Package the application
RUN mvn clean install -DskipTests

# --------------------
# Final Image Stage
# --------------------
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port Render will assign via env variable
ENV PORT 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
