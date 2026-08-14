# LPVN HR Flow — Phase 14: Production Deployment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finalize all production deployment readiness artifacts, production deployment guide, Cloudflare / Supabase deployment verification tests, and interactive Production Deployment Hub.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-14-production-deployment.md`

---

### Task 1: Production Guide & Readiness Verification Test

**Files:**
- Create: `docs/deployment/production-guide.md`
- Create: `src/tests/production-deployment-readiness.test.ts`

- [ ] **Step 1: Write `docs/deployment/production-guide.md`** with Supabase DB migrations, Cloudflare Pages build, Domain SSL setup, daily backup, and rollback procedures.
- [ ] **Step 2: Write `src/tests/production-deployment-readiness.test.ts`** to verify all production checklist items and environment requirements.
- [ ] **Step 3: Run vitest and verify test passes**.

---

### Task 2: Production Deployment Hub Component & Page

**Files:**
- Create: `src/components/business/ProductionDeploymentHub.tsx`, `src/components/business/ProductionDeploymentHub.test.tsx`
- Create: `src/pages/ProductionDeploymentPage.tsx`, `src/pages/ProductionDeploymentPage.test.tsx`
- Modify: `src/components/layout/Sidebar.tsx`, `src/App.tsx`, `src/components/layout/AppShell.test.tsx`

- [ ] **Step 1: Create `ProductionDeploymentHub.tsx` & `.test.tsx`** (UAT checklist, Go-Live status, environment config checker).
- [ ] **Step 2: Create `ProductionDeploymentPage.tsx` & `.test.tsx`** at route `/settings/deployment`.
- [ ] **Step 3: Update `Sidebar.tsx`, `App.tsx`, and `AppShell.test.tsx`**.
- [ ] **Step 4: Run `./scripts/quality-gate.sh` and update `plan.md` & `state.json`**.
