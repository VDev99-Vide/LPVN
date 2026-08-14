-- Phase 09: Document Template & Rendering Pipeline System
-- Creates document_templates and generated_documents tables with seeds, indexes and RLS

CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  current_version VARCHAR(20) NOT NULL DEFAULT '1.0',
  field_mappings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
  document_no VARCHAR(50) NOT NULL,
  source_entity_type VARCHAR(50) NOT NULL CHECK (source_entity_type IN ('LEAVE', 'GATE_PASS', 'ATTENDANCE_CONFIRMATION')),
  source_entity_id UUID NOT NULL,
  rendered_data_snapshot JSONB NOT NULL,
  document_hash VARCHAR(64) NOT NULL,
  file_url TEXT,
  generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed initial ISO Templates
INSERT INTO public.document_templates (template_code, title, title_en, current_version)
VALUES
  ('LPVN-HR-F-0013', 'Đơn Xin Nghỉ Phép', 'Leave Application', '1.0'),
  ('LPVN-HR-F-0014', 'Giấy Phép Ra Cổng', 'Employee Gate Pass', '1.0'),
  ('LPVN-HR-F-0008', 'Phiếu Yêu Cầu Xác Nhận Ngày Công', 'Attendance Confirmation Form', '1.0')
ON CONFLICT (template_code) DO NOTHING;

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Document templates viewable by authenticated users" 
  ON public.document_templates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Generated documents viewable by authenticated users" 
  ON public.generated_documents FOR SELECT TO authenticated USING (true);

CREATE POLICY "Generated documents insertable by authenticated users" 
  ON public.generated_documents FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gen_docs_source ON public.generated_documents(source_entity_type, source_entity_id);
CREATE INDEX IF NOT EXISTS idx_gen_docs_hash ON public.generated_documents(document_hash);
CREATE INDEX IF NOT EXISTS idx_gen_docs_template ON public.generated_documents(template_id);
