-- Phase 11c: Microsoft Entra ID (Azure AD) Integration
-- Adds entra_object_id, azure_tenant_id, sso_provider, and sso_metadata to profiles table

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS entra_object_id VARCHAR(100) UNIQUE,
  ADD COLUMN IF NOT EXISTS azure_tenant_id VARCHAR(100),
  ADD COLUMN IF NOT EXISTS sso_provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN IF NOT EXISTS sso_metadata JSONB DEFAULT '{}'::jsonb;

-- Indexes for lightning fast SSO lookups
CREATE INDEX IF NOT EXISTS idx_profiles_entra_object ON public.profiles(entra_object_id);
CREATE INDEX IF NOT EXISTS idx_profiles_sso_provider ON public.profiles(sso_provider);
