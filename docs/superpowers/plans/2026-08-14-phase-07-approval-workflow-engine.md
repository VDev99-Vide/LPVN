# Phase 07 — Approval Workflow Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the generic Approval Workflow Engine with unified multi-document task queues, anti-replay security tokens, transition audit trail, Unified Approvals Hub UI, and manager resolution.

**Tech Stack:** React 19, TypeScript strict, Supabase Auth + PostgreSQL + RLS, Vitest + RTL, Tailwind CSS v4 + Radix primitives.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-07-approval-workflow-engine.md`

---

### Task 1: Approval Workflow Database Migration & Types

**Files:**
- Create: `supabase/migrations/20260814000009_approval_workflow_engine.sql`
- Modify: `src/types/database.types.ts`
- Test: `src/types/database.types.test.ts`

- [ ] **Step 1: Create SQL migration `supabase/migrations/20260814000009_approval_workflow_engine.sql`**
- [ ] **Step 2: Update `src/types/database.types.ts` with `approval_tasks` and `workflow_transitions`**
- [ ] **Step 3: Run database type tests**

---

### Task 2: Workflow Service Layer

**Files:**
- Create: `src/services/workflow.service.ts`, `src/services/workflow.service.test.ts`

- [ ] **Step 1: Write unit tests for `workflowService`**
- [ ] **Step 2: Implement `src/services/workflow.service.ts`**
- [ ] **Step 3: Run service tests**

---

### Task 3: Workflow UI Components

**Files:**
- Create: `src/components/business/WorkflowTaskCard.tsx`, `src/components/business/WorkflowTaskCard.test.tsx`
- Create: `src/components/business/WorkflowTimeline.tsx`, `src/components/business/WorkflowTimeline.test.tsx`
- Create: `src/components/business/UnifiedApprovalsHub.tsx`, `src/components/business/UnifiedApprovalsHub.test.tsx`

- [ ] **Step 1: Create `WorkflowTaskCard`**
- [ ] **Step 2: Create `WorkflowTimeline`**
- [ ] **Step 3: Create `UnifiedApprovalsHub`**
- [ ] **Step 4: Run component tests**

---

### Task 4: Main Page & Navigation

**Files:**
- Create: `src/pages/ApprovalsHubPage.tsx`, `src/pages/ApprovalsHubPage.test.tsx`
- Modify: `src/App.tsx`, `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `ApprovalsHubPage`**
- [ ] **Step 2: Update `App.tsx` and `Sidebar.tsx` navigation**
- [ ] **Step 3: Run page test**

---

### Task 5: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
