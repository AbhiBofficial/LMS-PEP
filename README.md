# 📚 Libris — Premium Library Management Platform

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://lms-pep.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://lms-pep-api.onrender.com)

Libris is a production-grade, full-stack library management system with a premium, modern UI. Manage books, patrons, borrowing history, overdue fines, and user roles — all in one place.

## 🔗 Live Deployment

| Service  | URL |
|----------|-----|
| **Frontend** | https://lms-pep.vercel.app |
| **Backend API** | https://lms-pep-api.onrender.com |
| **Swagger Docs** | https://lms-pep-api.onrender.com/swagger-ui.html |

> **Note**: The backend is on Render's free tier. The first request after inactivity may take 30–60 seconds while the server wakes up.

## ✨ Features

- **Premium Interface** — Floating nav, dark/light mode toggle, command palette (Ctrl+K), and Framer Motion animations
- **Enterprise Security** — JWT access tokens + refresh tokens, Role-Based Access Control (ADMIN / LIBRARIAN / USER)
- **Book Catalog** — Full CRUD with pagination, search by title/ISBN/description, filter by author/category/availability
- **Borrow & Return** — One-click borrowing and returns with automatic 14-day loan period
- **Fine Calculation** — Auto-calculates overdue fines (₹2/day) with real-time status tracking
- **Patron Management** — Create/view users with role assignment, active borrow counts
- **Audit Logging** — Every system action is logged with actor, entity, timestamp, and IP address
- **Dashboard Analytics** — Real-time stats: total books, active borrows, overdue count, popular categories
- **Responsive Design** — Mobile-first layout with hamburger menu, works on all screen sizes

## 🛠 Tech Stack

**Backend**
| Technology | Purpose |
|------------|---------|
| Java 21 + Spring Boot 3 | Core API framework |
| Spring Security + JWT | Authentication & authorization |
| Spring Data JPA + Hibernate | ORM and database access |
| PostgreSQL | Relational database |
| Flyway | Database migrations |
| MapStruct + Lombok | DTO mapping & boilerplate reduction |
| Swagger / OpenAPI | Auto-generated API docs |

**Frontend**
| Technology | Purpose |
|------------|---------|
| React 19 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS v3 | Utility-first styling |
| Framer Motion | Page/component animations |
| TanStack React Query | Server state & caching |
| Zustand | Client-side state (auth + theme) |
| React Hook Form + Zod | Form validation |
| Lucide React | Icon library |
| Sonner | Toast notifications |

## 📂 Folder Structure

```
LMS-PEP/
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI (AppLayout, StatCard, etc.)
│   │   ├── lib/             # API client (axios) & utilities
│   │   ├── pages/           # Route-level views
│   │   ├── store/           # Zustand (auth + theme)
│   │   └── types/           # TypeScript API types
│   ├── vercel.json          # Vercel deployment config
│   └── tailwind.config.ts   # Design tokens
├── src/main/java/.../library/
│   ├── config/              # Spring beans, OpenAPI, properties
│   ├── controller/          # REST controllers
│   ├── dto/                 # Request/Response DTOs
│   ├── entity/              # JPA entities
│   ├── exception/           # Global error handling
│   ├── mapper/              # MapStruct mappers
│   ├── repository/          # Spring Data repositories
│   ├── security/            # JWT filter, SecurityConfig
│   └── service/             # Business logic
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/        # Flyway SQL migrations
├── render.yaml              # Render backend deployment
└── README.md
```

## 🚀 Getting Started (Local Development)

### Prerequisites

- Java 21
- Node.js 18+
- Maven 3.9+
- PostgreSQL 15+ running on port `5432`
  - Database: `library_db`
  - User: `postgres` / Password: `postgres`

### 1. Database Setup

PostgreSQL must be running. The Flyway migrations run automatically on startup and create all tables and seed data.

### 2. Start Backend

```bash
./mvnw spring-boot:run
```

Backend available at: `http://localhost:8080`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:5173`

### Windows Quick Start (All-in-One)

```cmd
setup.bat   # Creates database, installs frontend deps, builds backend
run.bat     # Starts both backend and frontend concurrently
```

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@library.local` | `Password123!` |
| **Librarian** | `librarian@library.local` | `Password123!` |
| **User** | `user@library.local` | `Password123!` |

> Seeded automatically by Flyway migration `V2__seed_data.sql`

## ☁️ Deployment

### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set environment variable: `VITE_API_URL=https://lms-pep-api.onrender.com`
4. Deploy — Vercel handles the Vite build automatically

### Backend → Render (using `render.yaml`)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect the `AbhiBofficial/LMS-PEP` GitHub repository
4. Render automatically reads `render.yaml` and:
   - Creates a PostgreSQL database (`lms-pep-db`)
   - Deploys the Spring Boot API as a Java web service
   - Wires DB credentials as environment variables
5. Backend is live at `https://lms-pep-api.onrender.com`

### Environment Variables (Render)

These are set automatically by `render.yaml`:

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection string (from DB) |
| `SPRING_DATASOURCE_USERNAME` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `LIBRARY_JWT_SECRET` | Auto-generated JWT signing key |
| `LIBRARY_JWT_ACCESS_TOKEN_TTL` | `60m` |
| `LIBRARY_JWT_REFRESH_TOKEN_TTL` | `7d` |
| `LIBRARY_LOAN_DAYS` | `14` |
| `LIBRARY_FINE_PER_LATE_DAY` | `2.00` (INR) |

## 🧪 Testing

```bash
./mvnw test
```

## 📖 API Documentation

Swagger UI (local): `http://localhost:8080/swagger-ui.html`  
Swagger UI (production): `https://lms-pep-api.onrender.com/swagger-ui.html`

## 📝 Recent Changes

- ✅ Added visible logout button to navigation bar
- ✅ Added mobile hamburger menu with full navigation
- ✅ Added loading spinners and error states to all pages
- ✅ Fixed `returnBook` type mismatch (now correctly shows fine amounts in INR)
- ✅ Added user guard on "Add User" button (staff only)
- ✅ Added user avatar with initials fallback on Profile page
- ✅ Redesigned Categories page as card grid
- ✅ Added color-coded status badges across all tables
- ✅ Fixed theme (dark/light) applied on login/register/landing pages
- ✅ Added 30-second API timeout for Render cold starts
- ✅ Added inline form validation errors on all forms
- ✅ Changed currency display to INR (₹)
- ✅ Updated README with correct demo password and deployment instructions
