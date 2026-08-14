-- Phase 08: Digital Signature Library System
-- Creates digital_signatures and signature_audit_logs tables with indexes and RLS

CREATE TABLE IF NOT EXISTS public.digital_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  signature_type VARCHAR(50) NOT NULL DEFAULT 'ELECTRONIC_IMAGE' 
    CHECK (signature_type IN ('ELECTRONIC_IMAGE', 'CANVAS_DRAWN', 'DIGITAL_CERTIFICATE')),
  signature_url TEXT NOT NULL,
  title VARCHAR(100) DEFAULT 'Chữ ký cá nhân',
  is_default BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.signature_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signature_id UUID REFERENCES public.digital_signatures(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  document_id UUID,
  document_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.digital_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own signatures" 
  ON public.digital_signatures FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own signatures" 
  ON public.digital_signatures FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own signatures" 
  ON public.digital_signatures FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete their own signatures" 
  ON public.digital_signatures FOR DELETE TO authenticated USING (true);

CREATE POLICY "Signature audit logs viewable by authenticated users" 
  ON public.signature_audit_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Signature audit logs insertable by authenticated users" 
  ON public.signature_audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_signatures_user ON public.digital_signatures(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_signatures_default ON public.digital_signatures(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_signature_audit_sig ON public.signature_audit_logs(signature_id);
