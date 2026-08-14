# Phase 11d — Outlook Advanced Approval Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Outlook Advanced Mode with Microsoft Graph API adapter, Actionable Message Adaptive Cards payload generator, In-Email HTTP action endpoint handler, and OutlookCapabilityDetector.

**Tech Stack:** React 19, TypeScript strict, Vitest + RTL, Supabase PostgreSQL, Tailwind CSS v4, Lucide Icons.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-11d-outlook-advanced-approval-mode.md`

---

### Task 1: Outlook Advanced Service Layer

**Files:**
- Create: `src/services/outlook-advanced.service.ts`, `src/services/outlook-advanced.service.test.ts`

- [ ] **Step 1: Write unit tests for `outlookAdvancedService`**
- [ ] **Step 2: Implement `src/services/outlook-advanced.service.ts`**
- [ ] **Step 3: Run service tests**

---

### Task 2: UI Components

**Files:**
- Create: `src/components/business/AdaptiveCardPreview.tsx`, `src/components/business/AdaptiveCardPreview.test.tsx`
- Create: `src/components/business/OutlookCapabilitySwitcher.tsx`, `src/components/business/OutlookCapabilitySwitcher.test.tsx`
- Create: `src/components/business/GraphApiConfigModal.tsx`, `src/components/business/GraphApiConfigModal.test.tsx`

- [ ] **Step 1: Create `AdaptiveCardPreview`**
- [ ] **Step 2: Create `OutlookCapabilitySwitcher`**
- [ ] **Step 3: Create `GraphApiConfigModal`**
- [ ] **Step 4: Run component tests**

---

### Task 3: Page Integration & Navigation

**Files:**
- Create: `src/pages/OutlookAdvancedConfigPage.tsx`, `src/pages/OutlookAdvancedConfigPage.test.tsx`
- Modify: `src/App.tsx`, `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `OutlookAdvancedConfigPage`**
- [ ] **Step 2: Update `App.tsx` and `Sidebar.tsx` routing**
- [ ] **Step 3: Run page tests**

---

### Task 4: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
