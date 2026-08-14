# LPVN HR Flow — Supply Chain Workflow & Template.html Overhaul Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the entire application to replicate the exact UX/UI flow and role-based operational model of `Template.html`, customized for the **Supply Chain** department with clean login, ISO form creation with medical file attachments, role-tailored navigation, top ranking dashboard for supervisors, frontend user creator for admin, and approver email notifications.

**Spec:** `docs/superpowers/specs/2026-08-14-lpvn-supplychain-workflow-overhaul.md`

---

### Task 1: Auth & Login Screen Redesign

**Files:**
- Modify: `src/pages/LoginPage.tsx`, `src/pages/LoginPage.test.tsx`, `src/contexts/AuthContext.tsx`

- [ ] **Step 1: Update `LoginPage.tsx`**:
  - Center `Leggett.jpg` logo in header.
  - Main header title `LPVN` without verbose description.
  - Username / Email, Password inputs, `Đăng nhập` button.
  - Remember login state via localStorage.
  - Remove demo disclaimer box completely.
  - Quick demo profile switcher for seamless testing (`Nguyễn Văn A (Employee - Supply Chain)`, `Lê Văn C (Team Leader - Supply Chain)`, `Trần Thị B (Supervisor - Supply Chain)`, `Aaron Zhang (Admin)`).
- [ ] **Step 2: Verify `LoginPage.test.tsx` passes**

---

### Task 2: Role-Based Dynamic Navigation & Header Pending Badge

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/AppShell.test.tsx`

- [ ] **Step 1: Update `Sidebar.tsx`** to dynamically filter navigation based on role:
  - `EMPLOYEE`: Tạo đơn mới, Đơn của tôi, Thư viện chữ ký.
  - `TEAM_LEADER`: Tạo đơn mới, Đơn của tôi, Duyệt đơn (kèm pending count badge), Thư viện chữ ký.
  - `SUPERVISOR`: Dashboard (Top rank & Thống kê tháng), Tạo đơn mới, Đơn của tôi, Duyệt đơn (kèm badge), Báo cáo nghỉ phép, Thư viện chữ ký.
  - `ADMIN`: Toàn quyền quản trị (Dashboard, Nhân sự, Sơ đồ tổ chức, Quản lý Phòng ban Supply Chain, Mẫu đơn ISO, Tạo tài khoản trực tiếp, v.v.).
- [ ] **Step 2: Verify `AppShell.test.tsx` passes**

---

### Task 3: Unified "Tạo đơn mới" Page with Medical Attachment Support

**Files:**
- Create: `src/pages/NewRequestPage.tsx`, `src/pages/NewRequestPage.test.tsx`
- Create: `src/pages/MyRequestsPage.tsx`, `src/pages/MyRequestsPage.test.tsx`

- [ ] **Step 1: Create `NewRequestPage.tsx`**:
  - 3 tabs: `🚪 Giấy phép ra cổng` (LPVN-HR-F-0014), `🌴 Đơn xin nghỉ phép` (LPVN-HR-F-0013), `🗓️ Xác nhận ngày công` (LPVN-HR-F-0008).
  - For leave types other than Annual leave (e.g. Sick leave, Marriage, Bereavement, Unpaid), provide file upload / attachment input for medical certificate (`Giấy khám chữa bệnh / Minh chứng đính kèm`).
  - Real-time leave balance ticker for Supply Chain employees.
- [ ] **Step 2: Create `MyRequestsPage.tsx`**:
  - Status tracking table with direct ISO Document View and PDF export with digital signature stamped.
- [ ] **Step 3: Verify tests pass**

---

### Task 4: Supervisor Dashboard & Leave Top Ranking

**Files:**
- Modify: `src/pages/DashboardPage.tsx`, `src/pages/DashboardPage.test.tsx`
- Modify: `src/pages/ReportsPage.tsx`

- [ ] **Step 1: Update `DashboardPage.tsx`**:
  - Stats for Supply Chain department: Pending approvals, Approved, Remaining leave, Team size.
  - **Top Rank Nghỉ Phép** table for Supervisors: Rank employees by total leave days, Annual leave, Sick leave, and Personal leave.
  - Recent activity with interactive status badges.
- [ ] **Step 2: Verify `DashboardPage.test.tsx` passes**

---

### Task 5: Admin User Creation & Department Management

**Files:**
- Create: `src/components/business/AdminUserCreatorModal.tsx`, `src/components/business/AdminUserCreatorModal.test.tsx`
- Modify: `src/pages/EmployeesPage.tsx`

- [ ] **Step 1: Create `AdminUserCreatorModal.tsx`**:
  - Direct frontend user creation: Username/Code, Full Name, Email (Outlook/Gmail for approvers), Password, Department (Supply Chain default), Position, Role (`EMPLOYEE`, `TEAM_LEADER`, `SUPERVISOR`, `ADMIN`).
- [ ] **Step 2: Integrate into `EmployeesPage.tsx`**
- [ ] **Step 3: Verify tests pass**

---

### Task 6: Routing, Template.html Cleanup & Final Quality Gate

**Files:**
- Modify: `src/App.tsx`, `plan.md`, `state.json`
- Delete: `Template.html`

- [ ] **Step 1: Update `App.tsx` routing for all new views**
- [ ] **Step 2: Delete `Template.html`**
- [ ] **Step 3: Run `./scripts/quality-gate.sh` and verify all tests pass**
