# 🎓 Student Complaint System

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://jdk.java.net/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-sky.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

A full-stack, enterprise-grade web application for student complaint registration, real-time status tracking, and administrative issue resolution workflows.

---

## 📸 Key Features

### 👨‍🎓 Student Portal
* **Submit Complaints**: Simple form to register complaints with Category (`Academic`, `Hostel`, `Infrastructure`), Title, and Description.
* **Auto Student Registration**: Automatically registers new student Roll IDs on first complaint submission.
* **Real-time Status Tracking**: Search complaints by Student Roll ID and track resolution status with color-coded badges (`PENDING` 🟡, `APPROVED` 🟢, `REJECTED` 🔴).

### 👨‍💼 Admin Dashboard
* **Metric Cards**: Real-time summary cards for Total, Pending, Approved, and Rejected complaints.
* **Status Filtering**: Filter complaints table by `All`, `Pending`, `Approved`, or `Rejected`.
* **Action Buttons**: One-click **Approve** (Green) or **Reject** (Red) actions with real-time UI state updates without full page reloads.

---

## 🏗️ System Architecture & Component Hierarchy

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
│   ├── ComplaintForm.jsx        (Form with Validation & Feedback Banners)              │
│   ├── ComplaintList.jsx        (Status Badges & Search Filter)                        │
│   ├── AdminDashboard.jsx       (Metrics Summary Cards & Status Filters)               │
│   ├── AdminComplaintTable.jsx  (Real-Time Approve & Reject Action Table)            │
│   └── api/complaintApi.js      (Axios HTTP Client Layer - Port 8081)                 │
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
│   ├── Exception Handler  (GlobalExceptionHandler.java - Clean HTTP 400 Responses)     │
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

## 📁 Directory Structure

```text
student-complaint-system/
├── src/main/java/com/complaint/system/
│   ├── config/
│   │   ├── DatabaseSeeder.java         # Initial sample data seeder
│   │   └── WebConfig.java              # Global CORS configuration
│   ├── controller/
│   │   └── ComplaintController.java    # REST API endpoints (@CrossOrigin)
│   ├── dto/
│   │   ├── AdminDecisionDTO.java       # Request payload for status update
│   │   ├── ComplaintRequestDTO.java    # Request payload for submission
│   │   └── ComplaintResponseDTO.java   # Response DTO
│   ├── exception/
│   │   └── GlobalExceptionHandler.java # Custom REST exception handling
│   ├── model/
│   │   ├── Complaint.java              # Complaint JPA Entity
│   │   ├── ComplaintStatus.java        # Enum (PENDING, APPROVED, REJECTED)
│   │   └── Student.java                # Student JPA Entity
│   ├── repository/
│   │   ├── ComplaintRepository.java    # Spring Data JPA Repository
│   │   └── StudentRepository.java      # Spring Data JPA Repository
│   ├── service/
│   │   ├── ComplaintService.java       # Service Interface
│   │   └── impl/
│   │       └── ComplaintServiceImpl.java # Business Logic & Auto Student Registration
│   └── StudentComplaintApplication.java # Spring Boot Entrypoint
├── src/main/resources/
│   └── application.properties          # MySQL Connection & Port 8081 Config
├── src/test/java/com/complaint/system/
│   ├── controller/
│   │   └── ComplaintControllerTest.java # @WebMvcTest Controller Unit Tests
│   └── repository/
│       └── ComplaintRepositoryTest.java  # @DataJpaTest Persistence Tests
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── complaintApi.js         # Axios API Client
│   │   │   └── complaintApi.test.js    # Vitest API client tests
│   │   ├── components/
│   │   │   ├── AdminComplaintTable.jsx # Admin Action Table
│   │   │   ├── AdminDashboard.jsx      # Admin Dashboard View
│   │   │   ├── AdminDashboard.test.jsx # Vitest Admin UI tests
│   │   │   ├── ComplaintForm.jsx       # Submission Form
│   │   │   ├── ComplaintList.jsx       # Complaint Cards with Status Badges
│   │   │   ├── Navbar.jsx              # Navigation Header
│   │   │   ├── StudentPortal.jsx       # Student View Container
│   │   │   └── StudentPortal.test.jsx  # Vitest Student UI tests
│   │   ├── App.jsx                     # Root React Component
│   │   ├── main.jsx                    # Vite Entrypoint
│   │   └── index.css                   # TailwindCSS Directives
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── E2E_Test_Plan.md                    # End-to-End Verification Guide
├── pom.xml                             # Maven Configuration
└── README.md                           # Documentation
```

---

## ⚡ Setup & Execution Guide

### Prerequisites
* **Java**: OpenJDK 21 or later
* **Node.js**: v18.0.0 or later (npm 9+)
* **Database**: MySQL Server 8.0+ running on `localhost:3306`

---

### Step 1: Database Setup
Ensure MySQL is running on `localhost:3306`. Create the database (optional - Spring Boot auto-creates it if configured):
```sql
CREATE DATABASE IF NOT EXISTS student_complaints;
```

---

### Step 2: Backend Setup (Spring Boot)
1. Open terminal and navigate to project root:
   ```powershell
   cd student-complaint-system
   ```
2. Verify `src/main/resources/application.properties` credentials:
   ```properties
   server.port=8081
   spring.datasource.url=jdbc:mysql://localhost:3306/student_complaints?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=anubhav2004
   ```
3. Run the Spring Boot application:
   ```powershell
   .\mvnw spring-boot:run
   ```
   *The backend starts on `http://localhost:8081`.*

4. Run automated test suite (`@DataJpaTest` & `@WebMvcTest`):
   ```powershell
   .\mvnw test
   ```

---

### Step 3: Frontend Setup (React 18 + Vite)
1. Open a new terminal window and navigate to the frontend directory:
   ```powershell
   cd student-complaint-system/frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Run dev server:
   ```powershell
   npm run dev
   ```
   *The frontend starts on `http://localhost:3000`.*

4. Run Vitest component & API unit test suite:
   ```powershell
   npx vitest run
   ```

---

## 📡 REST API Documentation

Base URL: `http://localhost:8081/api`

| Endpoint | Method | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/complaints` | `POST` | `ComplaintRequestDTO` | `201 Created` | Register a new complaint (Auto-registers student if new) |
| `/complaints` | `GET` | *None* | `200 OK` | Fetch all complaints (for Admin Dashboard) |
| `/complaints/student/{studentId}` | `GET` | *None* | `200 OK` | Fetch complaints for specific Student Roll ID |
| `/complaints/{id}/status` | `PATCH` | `AdminDecisionDTO` | `200 OK` | Update status to `APPROVED` or `REJECTED` |

### Sample JSON Payloads

#### 1. Submit Complaint (`POST /api/complaints`)
```json
{
  "studentId": "STU001",
  "title": "Wifi connectivity issue in Hostel Block B",
  "category": "HOSTEL",
  "description": "Wifi router on 2nd floor drops connection during peak study hours."
}
```

#### 2. Admin Decision (`PATCH /api/complaints/1/status`)
```json
{
  "status": "APPROVED",
  "adminRemark": "Maintenance team dispatched to upgrade router firmware."
}
```

---

## 📜 Progressive Commit History

```text
b969cf6 fix: auto-create missing student on complaint submission and add global exception handler
e994cb0 (tag: v1.0.0) chore: finalize project release v1.0.0
c6e3ca3 docs: add comprehensive project README, API table, and setup guide
7e57748 config: enable CORS cross-origin configuration for local frontend dev server
4baf1e8 test: add UI interaction tests for admin decision workflow
452ce74 feat: build admin dashboard with metric cards and approval/rejection actions
952182b test: add component tests for student portal submission and status badges
28d8ed8 feat: build student complaint submission form and tracking UI
785a684 test: add API client mock unit tests with Vitest
6064b7f feat: setup Axios API client layer and main layout navigation
750e53b chore: initialize React 18 + Vite + TailwindCSS frontend environment
01a431a test: add WebMvcTest unit tests for complaint REST API endpoints
b111ac3 feat: implement complaint DTOs, service layer, and controller endpoints
e543121 test: add JPA persistence integration tests for Complaint entity
433a8b7 feat: add Student and Complaint JPA entities with repositories and seeder
a738499 chore: setup Spring Boot dependencies and database configuration
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
