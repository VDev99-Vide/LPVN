-- Phase 05: Gate Pass System (LPVN-HR-F-0014)
-- Creates gate_passes table, indexes, RLS policies and seed data

CREATE TABLE IF NOT EXISTS public.gate_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_no VARCHAR(50) NOT NULL DEFAULT 'LPVN-HR-F-0014',
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason_type VARCHAR(50) NOT NULL CHECK (reason_type IN ('BUSINESS', 'PERSONAL_OR_RESIGNED')),
  reason_details TEXT,
  pass_date DATE NOT NULL DEFAULT CURRENT_DATE,
  from_time VARCHAR(10) NOT NULL,
  to_time VARCHAR(10) NOT NULL,
  accompanied_items TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL' 
    CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED')),
  approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  manager_notes TEXT,
  security_out_time TIMESTAMPTZ,
  security_in_time TIMESTAMPTZ,
  security_guard_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  security_guard_name VARCHAR(100),
  security_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gate_passes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Gate passes viewable by authenticated users" 
  ON public.gate_passes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Gate passes insertable by authenticated users" 
  ON public.gate_passes FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Gate passes updatable by authenticated users" 
  ON public.gate_passes FOR UPDATE TO authenticated USING (true);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_gate_passes_employee_id ON public.gate_passes(employee_id);
CREATE INDEX IF NOT EXISTS idx_gate_passes_pass_date ON public.gate_passes(pass_date);
CREATE INDEX IF NOT EXISTS idx_gate_passes_status ON public.gate_passes(status);
