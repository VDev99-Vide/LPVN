# LPVN HR Flow — Phase 13: Testing & Quality Assurance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full Integration and E2E test suites for Happy Path, Rejection & Balance rollback, Outlook Fallback resilience, and Cross-role isolation, along with a visual QA Dashboard.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-13-testing-and-qa.md`

---

### Task 1: End-to-End & Integration Test Suites

**Files:**
- Create: `src/tests/e2e-happy-path-workflow.test.ts`
- Create: `src/tests/e2e-rejection-and-fallback.test.ts`
- Create: `src/tests/cross-role-isolation.test.ts`

- [ ] **Step 1: Write `e2e-happy-path-workflow.test.ts`** (Full lifecycle test: Create request → Manager approval → Pipeline PDF generation → SHA256 checksum → Storage).
- [ ] **Step 2: Write `e2e-rejection-and-fallback.test.ts`** (Rejection reason requirement, leave balance recovery, Outlook fallback adapter).
- [ ] **Step 3: Write `cross-role-isolation.test.ts`** (Department barriers, permission enforcement).
- [ ] **Step 4: Run vitest and verify all 3 test suites pass**.

---

### Task 2: Visual QA Dashboard Component & Service

**Files:**
- Create: `src/services/qa-runner.service.ts`, `src/services/qa-runner.service.test.ts`
- Create: `src/components/business/QASuiteDashboard.tsx`, `src/components/business/QASuiteDashboard.test.tsx`
- Create: `src/pages/QATestPage.tsx`, `src/pages/QATestPage.test.tsx`

- [ ] **Step 1: Create `qaRunnerService`** to programmatically execute all test scenarios on demand.
- [ ] **Step 2: Create `QASuiteDashboard.tsx` & `QATestPage.tsx`** with interactive test run button and visual pass/fail progress bar.
- [ ] **Step 3: Update `Sidebar.tsx`, `App.tsx`, and `AppShell.test.tsx`**.
- [ ] **Step 4: Run `./scripts/quality-gate.sh` and update `plan.md` & `state.json`**.
