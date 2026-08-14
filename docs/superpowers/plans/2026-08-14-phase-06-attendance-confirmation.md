# Phase 06 — Attendance Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Attendance Confirmation (Phiếu xác nhận ngày công — LPVN-HR-F-0008) module for LPVN HR Flow, including database migration, TypeScript types, service layer, UI components, HR processing queue, ISO preview modal, and page routing.

**Tech Stack:** React 19, TypeScript strict, `@supabase/supabase-js`, Vitest + React Testing Library, Tailwind CSS v4 + shadcn/ui primitives.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-06-attendance-confirmation.md`

---

### Task 1: Attendance Confirmation Database Migration & Types

**Files:**
- Create: `supabase/migrations/20260814000008_attendance_confirmation_system.sql`
- Modify: `src/types/database.types.ts`
- Test: `src/types/database.types.test.ts`

- [ ] **Step 1: Create SQL migration `supabase/migrations/20260814000008_attendance_confirmation_system.sql`**
- [ ] **Step 2: Update `src/types/database.types.ts` with `attendance_confirmations` table**
- [ ] **Step 3: Run type tests and verify**

---

### Task 2: Attendance Confirmation Service Layer

**Files:**
- Create: `src/services/attendance.service.ts`, `src/services/attendance.service.test.ts`

- [ ] **Step 1: Write unit tests for `attendanceService`**
- [ ] **Step 2: Implement `src/services/attendance.service.ts`**
- [ ] **Step 3: Run service tests and verify**

---

### Task 3: UI Components

**Files:**
- Create: `src/components/business/AttendanceFormDrawer.tsx`, `src/components/business/AttendanceFormDrawer.test.tsx`
- Create: `src/components/business/AttendanceTable.tsx`, `src/components/business/AttendanceTable.test.tsx`
- Create: `src/components/business/AttendanceHRReviewTable.tsx`, `src/components/business/AttendanceHRReviewTable.test.tsx`
- Create: `src/components/business/AttendancePreviewModal.tsx`, `src/components/business/AttendancePreviewModal.test.tsx`

- [ ] **Step 1: Create `AttendanceFormDrawer`**
- [ ] **Step 2: Create `AttendanceTable`**
- [ ] **Step 3: Create `AttendanceHRReviewTable`**
- [ ] **Step 4: Create `AttendancePreviewModal`**
- [ ] **Step 5: Run component tests and verify**

---

### Task 4: Main Page & Navigation

**Files:**
- Create: `src/pages/AttendancePage.tsx`, `src/pages/AttendancePage.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `AttendancePage` with 3 tabs (My Requests, Manager Approvals, HR Processing)**
- [ ] **Step 2: Connect `/attendance` route in `App.tsx`**
- [ ] **Step 3: Run page test and verify**

---

### Task 5: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
