@echo off
echo =========================================================
echo Setting up Library Management Platform...
echo =========================================================

echo 1. Checking Database Setup...
echo Please ensure PostgreSQL is running on localhost:5432 with user "postgres" and password "postgres".
echo Creating database "library_db" if it doesn't exist...
set PGPASSWORD=postgres
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'library_db'" | findstr "1" >nul
if errorlevel 1 (
    psql -U postgres -c "CREATE DATABASE library_db;"
    echo Database created successfully.
) else (
    echo Database already exists.
)

echo.
echo 2. Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo 3. Building Backend...
call ./mvnw clean package -DskipTests

echo.
echo =========================================================
echo Setup Complete!
echo Run 'run.bat' to start the application.
echo =========================================================
pause
