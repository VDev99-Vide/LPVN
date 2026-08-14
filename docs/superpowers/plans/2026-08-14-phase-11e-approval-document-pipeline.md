# Phase 11e — Approval → Document Pipeline Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the end-to-end automated pipeline connecting workflow approval events to signature resolution, template version locking, immutable snapshot generation, SHA-256 integrity checksum, storage persistence, and automated employee notification dispatch.

**Tech Stack:** React 19, TypeScript strict, Vitest + RTL, Supabase PostgreSQL, Tailwind CSS v4, Web Crypto API (SHA-256).

**Spec:** `docs/superpowers/specs/2026-08-14-phase-11e-approval-document-pipeline.md`

---

### Task 1: Pipeline Service Layer

**Files:**
- Create: `src/services/approval-document-pipeline.service.ts`, `src/services/approval-document-pipeline.service.test.ts`

- [ ] **Step 1: Write unit tests for `approvalDocumentPipelineService`**
- [ ] **Step 2: Implement `src/services/approval-document-pipeline.service.ts`**
- [ ] **Step 3: Run service tests**

---

### Task 2: UI Components

**Files:**
- Create: `src/components/business/ApprovalPipelineStatusCard.tsx`, `src/components/business/ApprovalPipelineStatusCard.test.tsx`
- Create: `src/components/business/PipelineTriggerButton.tsx`, `src/components/business/PipelineTriggerButton.test.tsx`
- Create: `src/components/business/DocumentIntegrityVerifier.tsx`, `src/components/business/DocumentIntegrityVerifier.test.tsx`

- [ ] **Step 1: Create `ApprovalPipelineStatusCard`**
- [ ] **Step 2: Create `PipelineTriggerButton`**
- [ ] **Step 3: Create `DocumentIntegrityVerifier`**
- [ ] **Step 4: Run component tests**

---

### Task 3: Page Integration & Navigation

**Files:**
- Create: `src/pages/DocumentPipelinePage.tsx`, `src/pages/DocumentPipelinePage.test.tsx`
- Modify: `src/App.tsx`, `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `DocumentPipelinePage`**
- [ ] **Step 2: Update `App.tsx` and `Sidebar.tsx` routing**
- [ ] **Step 3: Run page tests**

---

### Task 4: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
