# Phase 11 — Notification Core & Email Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Multi-Channel Notification Engine for LPVN HR Flow SaaS with In-App alerts, Outlook-compatible HTML templates, and resilient Queue/Retry mechanism.

**Tech Stack:** React 19, TypeScript strict, Vitest + RTL, Supabase PostgreSQL + RLS, Tailwind CSS v4, Lucide Icons.

**Spec:** `docs/superpowers/specs/2026-08-14-phase-11-notification-core.md`

---

### Task 1: Notification Database Migration & Types

**Files:**
- Create: `supabase/migrations/20260814000012_notification_system.sql`
- Modify: `src/types/database.types.ts`
- Test: `src/types/database.types.test.ts`

- [ ] **Step 1: Create SQL migration `supabase/migrations/20260814000012_notification_system.sql`**
- [ ] **Step 2: Update `src/types/database.types.ts` with `notifications` and `notification_queue`**
- [ ] **Step 3: Run database type tests**

---

### Task 2: Notification & Email Template Services

**Files:**
- Create: `src/services/notification.service.ts`, `src/services/notification.service.test.ts`
- Create: `src/services/email-template.service.ts`, `src/services/email-template.service.test.ts`

- [ ] **Step 1: Write unit tests for `notificationService` and `emailTemplateService`**
- [ ] **Step 2: Implement `src/services/notification.service.ts`**
- [ ] **Step 3: Implement `src/services/email-template.service.ts`**
- [ ] **Step 4: Run service tests**

---

### Task 3: UI Components

**Files:**
- Create: `src/components/business/NotificationBell.tsx`, `src/components/business/NotificationBell.test.tsx`
- Create: `src/components/business/NotificationList.tsx`, `src/components/business/NotificationList.test.tsx`
- Create: `src/components/business/EmailPreviewModal.tsx`, `src/components/business/EmailPreviewModal.test.tsx`
- Create: `src/components/business/NotificationQueueTable.tsx`, `src/components/business/NotificationQueueTable.test.tsx`

- [ ] **Step 1: Create `NotificationBell`**
- [ ] **Step 2: Create `NotificationList`**
- [ ] **Step 3: Create `EmailPreviewModal`**
- [ ] **Step 4: Create `NotificationQueueTable`**
- [ ] **Step 5: Run component tests**

---

### Task 4: Main Page & Navigation

**Files:**
- Create: `src/pages/NotificationsPage.tsx`, `src/pages/NotificationsPage.test.tsx`
- Modify: `src/App.tsx`, `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `NotificationsPage`**
- [ ] **Step 2: Update `App.tsx` and `Sidebar.tsx` navigation**
- [ ] **Step 3: Run page test**

---

### Task 5: Quality Gate & Checkpoint

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` and `state.json`**
- [ ] **Step 2: Run `./scripts/quality-gate.sh` and verify all tests pass**
