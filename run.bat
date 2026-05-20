@echo off
echo =========================================================
echo Starting Library Management Platform...
echo =========================================================

echo Starting Backend Server in a new window...
start cmd /k ".\mvnw spring-boot:run"

echo Starting Frontend Server in a new window...
cd frontend
start cmd /k "npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8080/api/v1
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo =========================================================
