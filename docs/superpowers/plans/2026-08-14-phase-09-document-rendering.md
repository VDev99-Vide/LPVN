# Phase 09 — Document Template & Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Document Template & Rendering Pipeline for LPVN HR Flow SaaS, with SHA-256 integrity checksums, automatic digital signature injection, snapshot audit storage, and Document Center UI.

**Tech Stack:** React 19, TypeScript strict, Web Crypto API (SHA-256), Supabase Auth + PostgreSQL + RLS, Vitest + RTL, Tailwind CSS v4 + Print Styles.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-09-document-rendering.md`

---

### Task 1: Document Database Migration & Types

**Files:**
- Create: `supabase/migrations/20260814000011_document_rendering_system.sql`
- Modify: `src/types/database.types.ts`
- Test: `src/types/database.types.test.ts`

- [ ] **Step 1: Create SQL migration `supabase/migrations/20260814000011_document_rendering_system.sql`**
- [ ] **Step 2: Update `src/types/database.types.ts` with `document_templates` and `generated_documents`**
- [ ] **Step 3: Run database type tests**

---

### Task 2: Document Service Layer

**Files:**
- Create: `src/services/document.service.ts`, `src/services/document.service.test.ts`

- [ ] **Step 1: Write unit tests for `documentService`**
- [ ] **Step 2: Implement `src/services/document.service.ts`**
- [ ] **Step 3: Run service tests**

---

### Task 3: UI Components

**Files:**
- Create: `src/components/business/DocumentRenderer.tsx`, `src/components/business/DocumentRenderer.test.tsx`
- Create: `src/components/business/DocumentExportToolbar.tsx`, `src/components/business/DocumentExportToolbar.test.tsx`
- Create: `src/components/business/DocumentTemplateCatalog.tsx`, `src/components/business/DocumentTemplateCatalog.test.tsx`
- Create: `src/components/business/DocumentAuditDrawer.tsx`, `src/components/business/DocumentAuditDrawer.test.tsx`

- [ ] **Step 1: Create `DocumentRenderer`**
- [ ] **Step 2: Create `DocumentExportToolbar`**
- [ ] **Step 3: Create `DocumentTemplateCatalog`**
- [ ] **Step 4: Create `DocumentAuditDrawer`**
- [ ] **Step 5: Run component tests**

---

### Task 4: Main Page & Navigation

**Files:**
- Create: `src/pages/DocumentCenterPage.tsx`, `src/pages/DocumentCenterPage.test.tsx`
- Modify: `src/App.tsx`, `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `DocumentCenterPage`**
- [ ] **Step 2: Update `App.tsx` and `Sidebar.tsx` navigation**
- [ ] **Step 3: Run page test**

---

### Task 5: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
