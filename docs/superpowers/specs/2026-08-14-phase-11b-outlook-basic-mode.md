# Phase 11b — Outlook Basic Mode Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Triển khai quy trình phê duyệt qua email **Outlook Basic Mode** cho **LPVN HR Flow SaaS**:
- Vận hành độc lập không phụ thuộc quyền Admin Microsoft 365 Tenant (Zero M365 Admin Dependency).
- Tạo trải nghiệm liền mạch cho Manager: Nhận email trên Outlook Desktop/Mobile -> Bấm link -> Mở trang phê duyệt bảo mật -> Ký duyệt và đóng dấu tức thì.

---

## 2. Luồng Bảo Mật & Anti-Replay Token

```mermaid
sequenceDiagram
    participant Sys as LPVN Backend / Service
    participant Mail as Outlook Email Client
    participant Mgr as Manager (Approver)
    participant Gate as OutlookApprovalGate UI
    participant DB as Supabase DB

    Sys->>DB: Tạo approval_task + security_token (72h)
    Sys->>Mail: Gửi Email HTML kèm Deep Link (/quick-approve)
    Mgr->>Mail: Mở email và bấm [Xem & Phê Duyệt]
    Mail->>Gate: Mở trình duyệt với taskId & token
    Gate->>DB: Kiểm tra token & hạn sử dụng & danh tính Manager
    alt Token Hợp Lệ & Đúng Manager
        Gate-->>Mgr: Hiển thị giao diện duyệt nhanh + con dấu chữ ký
        Mgr->>Gate: Bấm [Đồng Ý Duyệt]
        Gate->>DB: Cập nhật APPROVED + Xóa token (Anti-Replay)
        Gate-->>Mgr: Thông báo hoàn tất & chuyển sang xem Biểu mẫu ISO
    else Token Hết Hạn hoặc Đã Dùng
        Gate-->>Mgr: Báo lỗi an toàn (Token Invalid/Expired)
    end
```
