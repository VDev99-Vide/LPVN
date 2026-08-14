# LPVN HR Flow — Phase 12: Security Hardening Specification

## 1. Mục tiêu (Objective)
Củng cố toàn diện an ninh hệ thống LPVN HR SaaS, bảo vệ dữ liệu nhân sự và quy trình phê duyệt chống lại các lỗ hổng bảo mật phổ biến (OWASP Top 10):
- **RLS Test Matrix:** Kiểm định toàn bộ chính sách Row Level Security trên các bảng dữ liệu Supabase (`profiles`, `employees`, `leave_requests`, `gate_pass_requests`, `attendance_confirmation_requests`, `approval_tasks`, `digital_signatures`, `documents`, `audit_logs`).
- **RBAC & ABAC Enforcement:** Phân quyền vai trò kết hợp bối cảnh thuộc tính phòng ban (`EMPLOYEE`, `TEAM_LEADER`, `SUPERVISOR`, `ADMIN`).
- **IDOR Defenses:** Ngăn chặn truy cập tài nguyên trái phép bằng cách can thiệp ID yêu cầu (Insecure Direct Object References).
- **Department Boundary Enforcement:** Giới hạn phạm vi phê duyệt chặt chẽ trong phòng ban (đặc biệt là Phòng Supply Chain).
- **Signature Isolation & Security:** Bảo vệ chữ ký nét ký cá nhân của Manager, chống rò rỉ hoặc sao chép trái phép.
- **Tamper-Resistant Audit Logs:** Xác thực tính toàn vẹn của lịch sử kiểm toán bằng mã băm HMAC-SHA256 chống sửa đổi.
- **Input Sanitization & Rate Limiting:** Làm sạch dữ liệu đầu vào chống XSS/Injection và giới hạn tần suất gọi API duyệt đơn.

---

## 2. Kiến Trúc Ma Trận Bảo Mật (Security Matrix)

| Bảng Dữ Liệu | Quyền EMPLOYEE | Quyền TEAM_LEADER | Quyền SUPERVISOR | Quyền ADMIN |
|---|---|---|---|---|
| `profiles` / `employees` | Xem bản thân | Xem nhân viên cùng phòng ban | Xem nhân viên cùng phòng ban | Toàn quyền CRUD |
| `leave_requests` | CRUD đơn của mình | Đọc đơn cùng phòng ban | Đọc đơn cùng phòng ban | Toàn quyền |
| `gate_pass_requests` | CRUD đơn của mình | Đọc đơn cùng phòng ban | Đọc đơn cùng phòng ban | Toàn quyền |
| `attendance_confirmation_requests` | CRUD đơn của mình | Đọc đơn cùng phòng ban | Đọc đơn cùng phòng ban | Toàn quyền |
| `approval_tasks` | Xem task của đơn mình | Xem & duyệt task gán cho mình | Xem & duyệt task phòng ban | Toàn quyền |
| `digital_signatures` | Chỉ xem & sửa chữ ký mình | Chỉ xem & sửa chữ ký mình | Chỉ xem & sửa chữ ký mình | Toàn quyền quản trị |
| `documents` / `generated_documents` | Tải PDF đơn của mình | Tải PDF đơn đã duyệt | Tải PDF đơn phòng ban | Toàn quyền |
| `audit_logs` | Không xem | Không xem | Xem log phòng ban | Xem & thẩm tra toàn vẹn |

---

## 3. Thành Phần Triển Khai
1. **Dịch Vụ `SecurityHardeningService` (`src/services/security-hardening.service.ts`):**
   - `validateRLSMatrix()`: Chạy kiểm tra ma trận RLS tự động.
   - `checkIDORAccess(userId, resourceType, resourceId, userRole, userDept)`: Kiểm tra hợp lệ trước khi cấp quyền truy cập.
   - `enforceDepartmentBoundary(approverDept, requestDept)`: Đảm bảo người duyệt cùng bộ phận với người làm đơn.
   - `verifyAuditLogIntegrity(logEntry)`: Đối chiếu mã băm HMAC-SHA256 phát hiện chỉnh sửa log.
   - `sanitizeInput(input)`: Làm sạch HTML tags, SQL keywords và ký tự độc hại.
   - `checkRateLimit(key, maxRequests, windowMs)`: Chặn spam/brute-force request.

2. **Giao Diện Điều Khiển An Ninh (`SecurityAuditDashboard.tsx`, `TamperProofAuditViewer.tsx`, `SecurityAuditPage.tsx`):**
   - Bảng trực quan hóa trạng thái 8 bài kiểm tra an ninh (RLS, IDOR, Boundary, Signature, HMAC Audit, Sanitization, Rate Limiting, Entra ID SSO).
   - Nút chạy quét an ninh theo thời gian thực (Live Security Scan).
   - Trình duyệt nhật ký kiểm toán với huy hiệu `✓ HMAC Verified (Bảo Toàn)`.
