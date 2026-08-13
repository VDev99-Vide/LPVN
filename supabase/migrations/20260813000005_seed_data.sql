-- Seed initial departments
INSERT INTO public.departments (code, name) VALUES
  ('BGD', 'Ban Giám đốc'),
  ('NS', 'Phòng Nhân sự'),
  ('TCKT', 'Phòng Tài chính - Kế toán'),
  ('IT', 'Phòng Công nghệ thông tin'),
  ('SX', 'Khối Sản xuất')
ON CONFLICT (code) DO NOTHING;

-- Seed initial positions
INSERT INTO public.positions (code, title, level) VALUES
  ('CEO', 'Tổng Giám Đốc', 1),
  ('HRM', 'Trưởng Phòng Nhân Sự', 2),
  ('TL_IT', 'Trưởng Nhóm IT', 3),
  ('DEV_SR', 'Lập Trình Viên Cao Cấp', 4),
  ('STAFF', 'Nhân Viên', 5)
ON CONFLICT (code) DO NOTHING;

-- Seed initial roles
INSERT INTO public.roles (code, name, description) VALUES
  ('ADMIN', 'Quản trị hệ thống', 'Quản trị viên hệ thống toàn quyền'),
  ('HR_MANAGER', 'Quản lý Nhân sự', 'Quản lý phòng Nhân sự'),
  ('DEPARTMENT_HEAD', 'Trưởng phòng', 'Trưởng bộ phận / phòng ban'),
  ('DIRECT_MANAGER', 'Quản lý trực tiếp', 'Quản lý nhóm / Quản lý trực tiếp'),
  ('EMPLOYEE', 'Nhân viên', 'Nhân viên chính thức')
ON CONFLICT (code) DO NOTHING;
