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

-- SELECT policy restricted to ADMIN and HR_MANAGER roles
CREATE POLICY "Allow Admin and HR to read audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin_or_hr());

-- Audit log trigger function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger AS $$
DECLARE
  v_record_id text;
  v_old_data jsonb := NULL;
  v_new_data jsonb := NULL;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_old_data := to_jsonb(OLD);
    IF (v_old_data ? 'id') THEN
      v_record_id := v_old_data->>'id';
    ELSIF (v_old_data ? 'user_id' AND v_old_data ? 'role_id') THEN
      v_record_id := (v_old_data->>'user_id') || ':' || (v_old_data->>'role_id');
    ELSIF (v_old_data ? 'role_id' AND v_old_data ? 'permission_id') THEN
      v_record_id := (v_old_data->>'role_id') || ':' || (v_old_data->>'permission_id');
    ELSE
      v_record_id := 'N/A';
    END IF;

    INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, actor_id)
    VALUES (TG_TABLE_NAME, v_record_id, TG_OP, v_old_data, v_new_data, auth.uid());
    RETURN OLD;
  ELSE
    IF (TG_OP = 'UPDATE') THEN
      v_old_data := to_jsonb(OLD);
    END IF;
    v_new_data := to_jsonb(NEW);
    IF (v_new_data ? 'id') THEN
      v_record_id := v_new_data->>'id';
    ELSIF (v_new_data ? 'user_id' AND v_new_data ? 'role_id') THEN
      v_record_id := (v_new_data->>'user_id') || ':' || (v_new_data->>'role_id');
    ELSIF (v_new_data ? 'role_id' AND v_new_data ? 'permission_id') THEN
      v_record_id := (v_new_data->>'role_id') || ':' || (v_new_data->>'permission_id');
    ELSE
      v_record_id := 'N/A';
    END IF;

    INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, actor_id)
    VALUES (TG_TABLE_NAME, v_record_id, TG_OP, v_old_data, v_new_data, auth.uid());
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers for core tables
CREATE OR REPLACE TRIGGER audit_departments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE OR REPLACE TRIGGER audit_positions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.positions
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE OR REPLACE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE OR REPLACE TRIGGER audit_manager_assignments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.manager_assignments
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE OR REPLACE TRIGGER audit_roles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE OR REPLACE TRIGGER audit_user_roles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
