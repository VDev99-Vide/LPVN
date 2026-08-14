# LPVN HR Flow — Phase 12: Security Hardening Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive security hardening covering RLS matrix validation, IDOR protection, department boundary enforcement (Supply Chain isolation), signature access control, HMAC-SHA256 audit log integrity checking, input sanitization, rate limiting, and an interactive Security Audit Dashboard.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-12-security-hardening.md`

---

### Task 1: Security Hardening Service Layer

**Files:**
- Create: `src/services/security-hardening.service.ts`
- Create: `src/services/security-hardening.service.test.ts`

- [ ] **Step 1: Write tests for `securityHardeningService`**
  - Test RLS matrix evaluation for 8 core tables.
  - Test IDOR defense allowing/denying access by role and owner ID.
  - Test Department boundary validation (e.g. Supply Chain vs HR).
  - Test HMAC-SHA256 audit log integrity computation & validation.
  - Test input sanitization against XSS payloads and script injections.
  - Test in-memory rate limiting.
- [ ] **Step 2: Implement `securityHardeningService`**
- [ ] **Step 3: Run vitest and verify all tests pass**

---

### Task 2: Security UI Components

**Files:**
- Create: `src/components/business/SecurityAuditDashboard.tsx`, `src/components/business/SecurityAuditDashboard.test.tsx`
- Create: `src/components/business/SecurityScanTrigger.tsx`, `src/components/business/SecurityScanTrigger.test.tsx`
- Create: `src/components/business/TamperProofAuditViewer.tsx`, `src/components/business/TamperProofAuditViewer.test.tsx`

- [ ] **Step 1: Create `SecurityAuditDashboard.tsx`** (Visual checklist of 8 OWASP security controls & status badges).
- [ ] **Step 2: Create `SecurityScanTrigger.tsx`** (Interactive button to run automated security posture evaluation).
- [ ] **Step 3: Create `TamperProofAuditViewer.tsx`** (Audit logs viewer with HMAC verification badge).
- [ ] **Step 4: Verify all component tests pass**

---

### Task 3: Security Page, Navigation & Quality Gate

**Files:**
- Create: `src/pages/SecurityAuditPage.tsx`, `src/pages/SecurityAuditPage.test.tsx`
- Modify: `src/components/layout/Sidebar.tsx`, `src/App.tsx`, `src/components/layout/AppShell.test.tsx`, `plan.md`, `state.json`

- [ ] **Step 1: Create `SecurityAuditPage.tsx`** at route `/settings/security`.
- [ ] **Step 2: Integrate navigation into `Sidebar.tsx` (for Admin) and `App.tsx`**.
- [ ] **Step 3: Update `AppShell.test.tsx` and run `./scripts/quality-gate.sh`**.
- [ ] **Step 4: Update `plan.md` & `state.json`**.
