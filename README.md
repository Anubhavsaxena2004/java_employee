# Student Complaint System (Full-Stack Application)

A full-stack web application for student complaint registration, administrative status decision workflows, and real-time issue tracking built with **Spring Boot 3 (Java 21)**, **MySQL**, **React 18 (Vite)**, and **TailwindCSS 3.4**.

---

## 1. System Architecture & Component Hierarchy

```text
                               ┌─────────────────────────┐
                               │  Browser Client (React) │
                               └────────────┬────────────┘
                                            │ HTTP (Axios)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND LAYER (Vite + React 18 + TailwindCSS 3.4)                                     │
│                                                                                        │
│   ├── Navbar.jsx               (Header & Role Switcher: Student vs Admin)             │
│   ├── StudentPortal.jsx        (Submission Form & Search Tracking View)               │
│   ├── AdminDashboard.jsx       (Metrics Summary Cards & Status Filters)               │
│   ├── AdminComplaintTable.jsx  (Real-Time Approve & Reject Action Table)            │
│   └── api/complaintApi.js      (Axios HTTP Client Layer)                              │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ REST API Calls (/api/complaints)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BACKEND LAYER (Spring Boot 3.4 + Java 21)                                             │
│                                                                                        │
│   ├── Controller Layer   (ComplaintController.java - REST Endpoints & CORS)            │
│   ├── Service Layer      (ComplaintService.java & ComplaintServiceImpl.java)          │
│   ├── Repository Layer   (StudentRepository.java & ComplaintRepository.java)         │
│   ├── Entity Layer       (Student.java & Complaint.java - JPA Annotations)            │
│   └── Config             (DatabaseSeeder.java & WebConfig.java)                       │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Spring Data JPA / JDBC
                                            ▼
                               ┌─────────────────────────┐
                               │   MySQL Database        │
                               │   (student_complaints)  │
                               └─────────────────────────┘
```

---

## 2. Environment Setup & Execution Guide

### Prerequisites
- **Java**: OpenJDK 21 or later
- **Node.js**: v18.0.0 or later (npm 9+)
- **Database**: MySQL Server 8.0+ running on port `3306`

---

### Step A: Database Configuration
Ensure MySQL service is running on `localhost:3306`.
Create database (optional - Spring Boot will automatically create it if enabled):
```sql
CREATE DATABASE IF NOT EXISTS student_complaints;
```

---

### Step B: Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```powershell
   cd student-complaint-system
   ```
2. Verify `src/main/resources/application.properties` credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_complaints?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=anubhav2004
   ```
3. Run the Spring Boot application:
   ```powershell
   .\mvnw spring-boot:run
   ```
   *The backend starts on `http://localhost:8080`.*

4. Run automated test suite (`@DataJpaTest` & `@WebMvcTest`):
   ```powershell
   .\mvnw test
   ```

---

### Step C: Frontend Setup (React 18 + Vite)
1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd student-complaint-system/frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Run the development server:
   ```powershell
   npm run dev
   ```
   *The frontend starts on `http://localhost:3000` (or `http://localhost:5173`).*

4. Run Vitest component & API unit test suite:
   ```powershell
   npx vitest run
   ```

---

## 3. REST API Documentation Table

Base URL: `http://localhost:8080/api`

| Endpoint | Method | Request Body / Params | HTTP Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/complaints` | `POST` | `ComplaintRequestDTO` | `201 Created` | Submit a new student complaint |
| `/complaints` | `GET` | None | `200 OK` | Fetch all complaints (for Admin) |
| `/complaints/student/{studentId}` | `GET` | `studentId` (PathVariable) | `200 OK` | Fetch complaints for specific student |
| `/complaints/{id}/status` | `PATCH` | `AdminDecisionDTO` | `200 OK` | Approve or Reject complaint status |

---

## 4. Progressive Commit History Structure

```text
* 4baf1e8 test: add UI interaction tests for admin decision workflow
* 452ce74 feat: build admin dashboard with metric cards and approval/rejection actions
* 952182b test: add component tests for student portal submission and status badges
* 28d8ed8 feat: build student complaint submission form and tracking UI
* 785a684 test: add API client mock unit tests with Vitest
* 6064b7f feat: setup Axios API client layer and main layout navigation
* 750e53b chore: initialize React 18 + Vite + TailwindCSS frontend environment
* 01a431a test: add WebMvcTest unit tests for complaint REST API endpoints
* b111ac3 feat: implement complaint DTOs, service layer, and controller endpoints
* e543121 test: add JPA persistence integration tests for Complaint entity
* 433a8b7 feat: add Student and Complaint JPA entities with repositories and seeder
* a738499 chore: setup Spring Boot dependencies and database configuration
```
