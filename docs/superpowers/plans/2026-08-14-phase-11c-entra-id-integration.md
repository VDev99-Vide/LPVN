# Phase 11c — Microsoft Entra ID (Azure AD) Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Microsoft Entra ID (Azure AD) SSO, Tenant Assessment, Group-to-Role Mapping, and Auth Fallback mechanism.

**Tech Stack:** React 19, TypeScript strict, Vitest + RTL, Supabase PostgreSQL, Tailwind CSS v4, Lucide Icons.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-11c-entra-id-integration.md`

---

### Task 1: Database Migration & Types

**Files:**
- Create: `supabase/migrations/20260814000013_entra_id_integration.sql`
- Modify: `src/types/database.types.ts`, `src/types/database.types.test.ts`

- [ ] **Step 1: Create SQL migration for Entra ID fields on `profiles`**
- [ ] **Step 2: Update `database.types.ts`**
- [ ] **Step 3: Run type tests**

---

### Task 2: Entra ID Service Layer

**Files:**
- Create: `src/services/entra-id.service.ts`, `src/services/entra-id.service.test.ts`

- [ ] **Step 1: Write unit tests for `entraIdService`**
- [ ] **Step 2: Implement `src/services/entra-id.service.ts`**
- [ ] **Step 3: Run service tests**

---

### Task 3: UI Components

**Files:**
- Create: `src/components/business/EntraTenantAssessmentCard.tsx`, `src/components/business/EntraTenantAssessmentCard.test.tsx`
- Create: `src/components/business/EntraGroupRoleMappingTable.tsx`, `src/components/business/EntraGroupRoleMappingTable.test.tsx`
- Create: `src/components/business/SSOLoginButton.tsx`, `src/components/business/SSOLoginButton.test.tsx`

- [ ] **Step 1: Create `EntraTenantAssessmentCard`**
- [ ] **Step 2: Create `EntraGroupRoleMappingTable`**
- [ ] **Step 3: Create `SSOLoginButton`**
- [ ] **Step 4: Run component tests**

---

### Task 4: Page Integration & Navigation

**Files:**
- Modify: `src/pages/LoginPage.tsx`, `src/pages/LoginPage.test.tsx`
- Create: `src/pages/EntraSettingsPage.tsx`, `src/pages/EntraSettingsPage.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Update `LoginPage` with Microsoft 365 SSO button**
- [ ] **Step 2: Create `EntraSettingsPage`**
- [ ] **Step 3: Update `App.tsx` routing**
- [ ] **Step 4: Run page tests**

---

### Task 5: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
