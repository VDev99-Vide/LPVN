-- Leave Types Table
CREATE TABLE IF NOT EXISTS public.leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT true,
  requires_attachment BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leave Entitlements Table
CREATE TABLE IF NOT EXISTS public.leave_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  base_days NUMERIC(4,1) NOT NULL DEFAULT 12.0,
  seniority_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  bonus_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  total_days NUMERIC(4,1) NOT NULL DEFAULT 12.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, year)
);

-- Leave Balances Table
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  leave_type_id UUID NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
  total_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  used_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  pending_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  remaining_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, year, leave_type_id)
);

-- Enable RLS
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leave types viewable by authenticated" ON public.leave_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leave entitlements viewable by authenticated" ON public.leave_entitlements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leave balances viewable by authenticated" ON public.leave_balances FOR SELECT TO authenticated USING (true);

-- Seed Leave Types
INSERT INTO public.leave_types (code, name, is_paid, requires_attachment) VALUES
  ('ANNUAL', 'Nghỉ phép năm', true, false),
  ('MARRIAGE', 'Nghỉ kết hôn', true, true),
  ('UNPAID', 'Nghỉ không hưởng lương', false, false),
  ('SICK', 'Nghỉ ốm đau', true, true),
  ('BEREAVEMENT', 'Nghỉ tang chế', true, false),
  ('MATERNITY', 'Nghỉ thai sản', true, true),
  ('OTHER', 'Nghỉ khác', false, false)
ON CONFLICT (code) DO NOTHING;
