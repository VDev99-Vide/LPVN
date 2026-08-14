# Phase 10 — Reporting & Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Reporting & Analytics Subsystem for LPVN HR Flow SaaS, featuring multi-dimensional aggregation, visual analytics charts, detailed employee tables, and CSV/Excel UTF-8 BOM export.

**Tech Stack:** React 19, TypeScript strict, Vitest + RTL, Tailwind CSS v4, Lucide Icons, Browser File Download API.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-10-reporting-analytics.md`

---

### Task 1: Reporting Service & CSV Export Engine

**Files:**
- Create: `src/services/reporting.service.ts`, `src/services/reporting.service.test.ts`

- [ ] **Step 1: Write unit tests for `reportingService`**
- [ ] **Step 2: Implement `src/services/reporting.service.ts`**
- [ ] **Step 3: Run service tests**

---

### Task 2: UI Analytics Components

**Files:**
- Create: `src/components/business/ReportMetricsGrid.tsx`, `src/components/business/ReportMetricsGrid.test.tsx`
- Create: `src/components/business/ReportCharts.tsx`, `src/components/business/ReportCharts.test.tsx`
- Create: `src/components/business/AnnualLeaveReportTable.tsx`, `src/components/business/AnnualLeaveReportTable.test.tsx`
- Create: `src/components/business/GatePassReportTable.tsx`, `src/components/business/GatePassReportTable.test.tsx`

- [ ] **Step 1: Create `ReportMetricsGrid`**
- [ ] **Step 2: Create `ReportCharts`**
- [ ] **Step 3: Create `AnnualLeaveReportTable`**
- [ ] **Step 4: Create `GatePassReportTable`**
- [ ] **Step 5: Run component tests**

---

### Task 3: Main Page & Navigation

**Files:**
- Create: `src/pages/ReportsPage.tsx`, `src/pages/ReportsPage.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `ReportsPage`**
- [ ] **Step 2: Connect `/reports` route in `App.tsx`**
- [ ] **Step 3: Run page test**

---

### Task 4: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
