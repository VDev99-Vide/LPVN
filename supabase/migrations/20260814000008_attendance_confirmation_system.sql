-- Phase 06: Attendance Confirmation System (LPVN-HR-F-0008)
-- Creates attendance_confirmations table, indexes, and RLS policies

CREATE TABLE IF NOT EXISTS public.attendance_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_no VARCHAR(50) NOT NULL DEFAULT 'LPVN-HR-F-0008',
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  confirmation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  from_time VARCHAR(10) NOT NULL,
  to_time VARCHAR(10) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL' 
    CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'HR_RECORDED', 'CANCELLED')),
  checker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  checked_at TIMESTAMPTZ,
  approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  hr_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  hr_recorded_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.attendance_confirmations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Attendance confirmations viewable by authenticated users" 
  ON public.attendance_confirmations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Attendance confirmations insertable by authenticated users" 
  ON public.attendance_confirmations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Attendance confirmations updatable by authenticated users" 
  ON public.attendance_confirmations FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON public.attendance_confirmations(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_confirmations(confirmation_date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance_confirmations(status);
