# Phase 05 — Gate Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Gate Pass (Giấy phép ra cổng — LPVN-HR-F-0014) management module for LPVN HR Flow, including SQL migration, TypeScript definitions, service layer with security check-in/out support, UI table, creation drawer form, security guard station, ISO preview modal, and main Gate Pass Page.

**Tech Stack:** React 19, TypeScript strict, `@supabase/supabase-js`, Vitest + React Testing Library, Tailwind CSS v4 + shadcn/ui primitives.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-05-gate-pass.md`

---

### Task 1: Gate Pass Database Migration & Types

**Files:**
- Create: `supabase/migrations/20260814000007_gate_pass_system.sql`
- Modify: `src/types/database.types.ts`
- Test: `src/types/database.types.test.ts`

- [ ] **Step 1: Create `supabase/migrations/20260814000007_gate_pass_system.sql`**
- [ ] **Step 2: Update `src/types/database.types.ts` with `gate_passes` table definition**
- [ ] **Step 3: Run database type test and commit**

---

### Task 2: Gate Pass Service Layer

**Files:**
- Create: `src/services/gate-pass.service.ts`, `src/services/gate-pass.service.test.ts`

- [ ] **Step 1: Write unit tests for gate pass service methods**
- [ ] **Step 2: Implement `gatePassService` (getGatePasses, createGatePass, updateStatus, recordSecurityAction)**
- [ ] **Step 3: Run service tests and commit**

---

### Task 3: Gate Pass UI Components

**Files:**
- Create: `src/components/business/GatePassFormDrawer.tsx`, `src/components/business/GatePassFormDrawer.test.tsx`
- Create: `src/components/business/GatePassTable.tsx`, `src/components/business/GatePassTable.test.tsx`
- Create: `src/components/business/GatePassSecurityStation.tsx`, `src/components/business/GatePassSecurityStation.test.tsx`
- Create: `src/components/business/GatePassPreviewModal.tsx`, `src/components/business/GatePassPreviewModal.test.tsx`

- [ ] **Step 1: Implement `GatePassFormDrawer` for registering new gate pass**
- [ ] **Step 2: Implement `GatePassTable` for list view with actions and ISO preview**
- [ ] **Step 3: Implement `GatePassSecurityStation` for rapid guard check-in/out**
- [ ] **Step 4: Implement `GatePassPreviewModal` wrapping `GatePassISO`**
- [ ] **Step 5: Run component tests and commit**

---

### Task 4: Main Gate Pass Page & Navigation

**Files:**
- Create: `src/pages/GatePassPage.tsx`, `src/pages/GatePassPage.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Implement `GatePassPage` with tabs: My Passes, Manager Approvals, Security Station**
- [ ] **Step 2: Connect `/gate-pass` routing in `App.tsx`**
- [ ] **Step 3: Run page test and commit**

---

### Task 5: Quality Gate & State Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
