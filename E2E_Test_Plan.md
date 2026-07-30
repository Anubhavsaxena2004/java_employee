# End-to-End (E2E) Integration Test Plan & Verification Matrix

---

## 1. Overview & Verification Goal
This document specifies the end-to-end integration test flow for the **Student Complaint System**, verifying real-time cross-talk between the **React 18 (Vite)** frontend and the **Spring Boot 3 (Java 21)** REST API backend.

---

## 2. Environment Prerequisites
- **MySQL Service**: Listening on `localhost:3306` with database `student_complaints`.
- **Backend Service**: Running on `http://localhost:8080` via `./mvnw spring-boot:run`.
- **Frontend Service**: Running on `http://localhost:3000` (or `http://localhost:5173`) via `npm run dev`.

---

## 3. End-to-End Workflow Execution Matrix

### Step 1: Student Complaint Submission
1. Navigate to **Student View** on the Frontend (`http://localhost:3000`).
2. Fill out the **Submit New Complaint** form:
   - **Student Roll ID**: `STU-101`
   - **Category**: `INFRASTRUCTURE`
   - **Title**: `Projector Failure in Lecture Hall B`
   - **Description**: `The HDMI port on the ceiling projector is loose and disconnects during lectures.`
3. Click **Submit Complaint**.
4. **Expected Result**:
   - Backend receives `POST /api/complaints`.
   - Returns `HTTP 201 Created` with payload: `{ id: 2, status: "PENDING", studentId: "STU-101" }`.
   - UI displays banner: `Complaint submitted successfully! Tracking ID: #2`.

---

### Step 2: Admin Dashboard Review & Decision
1. Click **Admin Dashboard** tab in the top navigation bar.
2. View **Metric Summary Cards**:
   - **Total Complaints**: Incremented (+1).
   - **Pending Action**: Incremented (+1).
3. Locate row with Student ID `STU-101` in the **Complaints Management Table**.
4. Status badge reads **`PENDING`** (Yellow).
5. Click **`Approve`** (Green Button).
6. **Expected Result**:
   - Frontend sends `PATCH /api/complaints/2/status` with body `{ status: "APPROVED", adminRemark: "Updated by Admin to APPROVED" }`.
   - Backend updates database record and returns `HTTP 200 OK`.
   - Real-time UI update: Action buttons are replaced by **`APPROVED`** (Green Badge).
   - Metrics update: Pending decrements (-1), Approved increments (+1).

---

### Step 3: Student Status Verification
1. Switch back to **Student View** tab.
2. Under **Track Complaints**, enter Student ID `STU-101` and click **Search**.
3. **Expected Result**:
   - Frontend sends `GET /api/complaints/student/STU-101`.
   - Complaint card is displayed with status **`APPROVED`** (Green Badge).
   - Admin Remark is rendered: `Updated by Admin to APPROVED`.

---

## 4. Verification Execution Status

| Verification Step | Target Endpoint | HTTP Status | Status Result |
| :--- | :--- | :--- | :--- |
| **1. Submit Complaint** | `POST /api/complaints` | `201 Created` | **PASSED** |
| **2. Fetch Admin Complaints** | `GET /api/complaints` | `200 OK` | **PASSED** |
| **3. Admin Approve Decision** | `PATCH /api/complaints/{id}/status` | `200 OK` | **PASSED** |
| **4. Student Track Complaint** | `GET /api/complaints/student/{studentId}` | `200 OK` | **PASSED** |
