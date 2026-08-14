# Phase 11b — Outlook Basic Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Outlook Basic Mode approval flow with short-lived tokens, anti-replay validation, Outlook Approval Gate UI, and zero Microsoft 365 Admin dependency.

**Tech Stack:** React 19, TypeScript strict, Vitest + RTL, Supabase PostgreSQL, Tailwind CSS v4, Lucide Icons.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-11b-outlook-basic-mode.md`

---

### Task 1: Outlook Basic Service Layer

**Files:**
- Create: `src/services/outlook-basic.service.ts`, `src/services/outlook-basic.service.test.ts`

- [ ] **Step 1: Write unit tests for `outlookBasicService`**
- [ ] **Step 2: Implement `src/services/outlook-basic.service.ts`**
- [ ] **Step 3: Run service tests**

---

### Task 2: UI Components

**Files:**
- Create: `src/components/business/OutlookApprovalGate.tsx`, `src/components/business/OutlookApprovalGate.test.tsx`
- Create: `src/components/business/OutlookDeepLinkGenerator.tsx`, `src/components/business/OutlookDeepLinkGenerator.test.tsx`
- Create: `src/components/business/OutlookCompatibilityBadge.tsx`, `src/components/business/OutlookCompatibilityBadge.test.tsx`

- [ ] **Step 1: Create `OutlookApprovalGate`**
- [ ] **Step 2: Create `OutlookDeepLinkGenerator`**
- [ ] **Step 3: Create `OutlookCompatibilityBadge`**
- [ ] **Step 4: Run component tests**

---

### Task 3: Main Page & Navigation

**Files:**
- Create: `src/pages/OutlookActionPage.tsx`, `src/pages/OutlookActionPage.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `OutlookActionPage`**
- [ ] **Step 2: Update `App.tsx` routing for `/quick-approve`**
- [ ] **Step 3: Run page test**

---

### Task 4: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
