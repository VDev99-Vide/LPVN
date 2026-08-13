-- Enable RLS on all 8 core HR & RBAC tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(role_code text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.code = role_code
  );
$$;

-- Helper function to check if current user is Admin or HR Manager
CREATE OR REPLACE FUNCTION public.is_admin_or_hr()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.has_role('ADMIN') OR public.has_role('HR_MANAGER');
$$;

-- SELECT policies for authenticated users on reference & RBAC tables
CREATE POLICY "Allow authenticated users to read departments"
  ON public.departments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read positions"
  ON public.positions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read roles"
  ON public.roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read permissions"
  ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read role permissions"
  ON public.role_permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read user roles"
  ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read manager assignments"
  ON public.manager_assignments FOR SELECT TO authenticated USING (true);

-- Profiles SELECT policies (self access, manager access, department head access, Admin/HR access)
CREATE POLICY "Allow users to read own profile"
  ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Allow managers to read subordinate profiles"
  ON public.profiles FOR SELECT TO authenticated USING (
    id IN (
      SELECT employee_id
      FROM public.manager_assignments
      WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Allow department heads to read department profiles"
  ON public.profiles FOR SELECT TO authenticated USING (
    department_id IN (
      SELECT id
      FROM public.departments
      WHERE department_head_id = auth.uid()
    )
  );

CREATE POLICY "Allow admin and hr to read all profiles"
  ON public.profiles FOR SELECT TO authenticated USING (
    public.is_admin_or_hr()
  );

-- Profiles UPDATE & INSERT policies
CREATE POLICY "Allow self or Admin/HR to update profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin_or_hr())
  WITH CHECK (id = auth.uid() OR public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to insert profiles"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_hr());

-- Mutation policies (INSERT, UPDATE, DELETE) for Admin and HR Managers on reference & RBAC tables
CREATE POLICY "Allow Admin and HR to insert departments"
  ON public.departments FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to update departments"
  ON public.departments FOR UPDATE TO authenticated USING (public.is_admin_or_hr()) WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to delete departments"
  ON public.departments FOR DELETE TO authenticated USING (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to insert positions"
  ON public.positions FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to update positions"
  ON public.positions FOR UPDATE TO authenticated USING (public.is_admin_or_hr()) WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to delete positions"
  ON public.positions FOR DELETE TO authenticated USING (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to insert roles"
  ON public.roles FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to update roles"
  ON public.roles FOR UPDATE TO authenticated USING (public.is_admin_or_hr()) WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to delete roles"
  ON public.roles FOR DELETE TO authenticated USING (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to insert permissions"
  ON public.permissions FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to update permissions"
  ON public.permissions FOR UPDATE TO authenticated USING (public.is_admin_or_hr()) WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to delete permissions"
  ON public.permissions FOR DELETE TO authenticated USING (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to insert role permissions"
  ON public.role_permissions FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to update role permissions"
  ON public.role_permissions FOR UPDATE TO authenticated USING (public.is_admin_or_hr()) WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to delete role permissions"
  ON public.role_permissions FOR DELETE TO authenticated USING (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to insert user roles"
  ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to update user roles"
  ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin_or_hr()) WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to delete user roles"
  ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to insert manager assignments"
  ON public.manager_assignments FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to update manager assignments"
  ON public.manager_assignments FOR UPDATE TO authenticated USING (public.is_admin_or_hr()) WITH CHECK (public.is_admin_or_hr());

CREATE POLICY "Allow Admin and HR to delete manager assignments"
  ON public.manager_assignments FOR DELETE TO authenticated USING (public.is_admin_or_hr());
