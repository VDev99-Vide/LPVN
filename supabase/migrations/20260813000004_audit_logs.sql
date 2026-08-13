-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- SELECT policy for authenticated users on audit_logs
CREATE POLICY "Allow authenticated users to read audit logs"
  ON public.audit_logs FOR SELECT TO authenticated USING (true);
