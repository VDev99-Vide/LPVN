-- Enable RLS on all 8 core HR & RBAC tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- SELECT policies for authenticated users on reference & RBAC tables
CREATE POLICY "Allow authenticated users to read departments"
  ON public.departments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read positions"
  ON public.positions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read roles"
  ON public.roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read permissions"
  ON public.permissions FOR SELECT TO authenticated USING (true);

-- Profiles SELECT policies (self access & manager access)
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
