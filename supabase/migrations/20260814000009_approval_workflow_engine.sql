-- Phase 07: Approval Workflow Engine System
-- Creates approval_tasks and workflow_transitions tables with indexes and RLS

CREATE TABLE IF NOT EXISTS public.approval_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('LEAVE', 'GATE_PASS', 'ATTENDANCE_CONFIRMATION')),
  document_id UUID NOT NULL,
  document_no VARCHAR(50) NOT NULL,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  decision_notes TEXT,
  decided_at TIMESTAMPTZ,
  security_token VARCHAR(100) UNIQUE,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workflow_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.approval_tasks(id) ON DELETE CASCADE,
  from_status VARCHAR(50) NOT NULL,
  to_status VARCHAR(50) NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.approval_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_transitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Approval tasks viewable by authenticated users" 
  ON public.approval_tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Approval tasks insertable by authenticated users" 
  ON public.approval_tasks FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Approval tasks updatable by authenticated users" 
  ON public.approval_tasks FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Workflow transitions viewable by authenticated users" 
  ON public.workflow_transitions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Workflow transitions insertable by authenticated users" 
  ON public.workflow_transitions FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_approval_tasks_approver ON public.approval_tasks(approver_id, status);
CREATE INDEX IF NOT EXISTS idx_approval_tasks_requester ON public.approval_tasks(requester_id);
CREATE INDEX IF NOT EXISTS idx_approval_tasks_doc ON public.approval_tasks(document_type, document_id);
CREATE INDEX IF NOT EXISTS idx_approval_tasks_token ON public.approval_tasks(security_token);
CREATE INDEX IF NOT EXISTS idx_workflow_transitions_task ON public.workflow_transitions(task_id);
