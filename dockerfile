FROM maven:3.9.14-eclipse-temurin-11-noble
WORKDIR /app
COPY pom.xml .
COPY src src
EXPOSE 8080
CMD ["/bin/sh", "-c", "mvn spring-boot:run"]