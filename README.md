# 📚 Libris - Premium Library Management Platform

Libris is a comprehensive, production-grade, full-stack library management system designed with a premium minimal interface. It features robust backend architecture using Spring Boot 3 and Java 21, coupled with a fast, modern React frontend.

## ✨ Features

- **Premium Interface**: Keyboard-first, dark-mode default UI with floating navigation and command palette.
- **Enterprise Security**: JWT Authentication, Refresh Tokens, and Role-Based Access Control (RBAC).
- **Comprehensive Entity Mapping**: Correctly implements all JPA mappings (OneToOne, OneToMany, ManyToOne, ManyToMany).
- **Audit Logging**: Tracks every action performed in the system.
- **Robust Database**: PostgreSQL powered with Flyway migrations.

## 🛠 Tech Stack

**Backend**:
- Java 21, Spring Boot 3, Spring Data JPA, Hibernate
- PostgreSQL, Flyway, MapStruct, Lombok
- Spring Security, JWT Auth
- Swagger/OpenAPI, JUnit, Mockito

**Frontend**:
- React 19, Vite, TypeScript
- Tailwind CSS (Premium SaaS UI)
- Zustand, React Query, React Router Dom
- Framer Motion, Lucide React, Recharts

## 📂 Folder Structure

```
library-management-api/
├── frontend/                # React Vite Application
│   ├── src/                 # Frontend source code
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # API client & utils
│   │   ├── pages/           # Application views
│   │   ├── store/           # Zustand state management
│   │   └── types/           # TypeScript definitions
│   └── tailwind.config.ts   # UI Theme configurations
├── src/                     # Spring Boot Application
│   ├── main/java/.../library/
│   │   ├── config/          # Bean configurations & Swagger
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Models (User, Book, Author, etc.)
│   │   ├── exception/       # Global Exception handling
│   │   ├── mapper/          # MapStruct mappers
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── security/        # JWT Filters & Auth logic
│   │   └── service/         # Business logic
│   └── main/resources/
│       ├── application.properties # Server config
│       └── db/migration/    # Flyway SQL scripts
```

## 🚀 Getting Started

### Prerequisites

- Java 21
- Node.js 18+
- Maven
- PostgreSQL running locally on port `5432` with user `postgres` and password `postgres`.

### 1. Setup Database & Dependencies

Run the setup script which will automatically create the PostgreSQL database, install frontend dependencies, and build the backend.

**Windows**:
```cmd
setup.bat
```

### 2. Running the Application

Run the start script to boot both the backend and frontend simultaneously.

**Windows**:
```cmd
run.bat
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api/v1
- **Swagger Docs**: http://localhost:8080/swagger-ui.html

## 🔑 Test Credentials (Seeded by Flyway)

- **Admin**: `admin@library.local` / `password`
- **Librarian**: `librarian@library.local` / `password`
- **User**: `user@library.local` / `password`

## 🧪 Testing

To run the automated test suite:

```bash
./mvnw test
```

## 📝 API Documentation

Access the automatically generated OpenAPI (Swagger) documentation while the backend is running at:
`http://localhost:8080/swagger-ui.html`
