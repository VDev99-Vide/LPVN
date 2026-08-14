# Phase 11d — Outlook Advanced Approval Mode Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Nâng cấp khả năng phê duyệt trực tiếp ngay trong giao diện Microsoft Outlook (In-Email 1-Click Actionable Messages):
- Sử dụng công nghệ **Microsoft Actionable Messages Adaptive Cards (JSON format v1.4)**.
- Quản lý có thể bấm nút `[ ✅ CHẤP NHẬN ]` hoặc `[ ❌ TỪ CHỐI ]` ngay trong email Outlook Desktop / Web OWA mà không cần mở trình duyệt web.
- Tự động chuyển đổi giữa **Advanced Mode** (nếu Tenant đã đăng ký Originator ID) và **Basic Mode** (Deep link an toàn) thông qua `OutlookCapabilityDetector`.

---

## 2. Cấu trúc Payload Actionable Message Adaptive Card

```json
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.4",
  "originator": "lpvn-flow-originator-id",
  "body": [
    {
      "type": "Container",
      "items": [
        { "type": "TextBlock", "text": "LPVN HR FLOW SAAS — YÊU CẦU PHÊ DUYỆT", "weight": "Bolder", "color": "Accent" },
        {
          "type": "FactSet",
          "facts": [
            { "title": "Loại đơn:", "value": "Đơn Xin Nghỉ Phép (LPVN-HR-F-0013)" },
            { "title": "Người gửi:", "value": "Trần Văn An (LPVN-0001)" },
            { "title": "Nội dung:", "value": "Nghỉ phép năm 2 ngày từ 20/08/2026" }
          ]
        },
        {
          "type": "Input.Text",
          "id": "decisionComment",
          "placeholder": "Ghi chú phê duyệt hoặc lý do từ chối (tùy chọn)...",
          "isMultiline": true
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Http",
      "title": "✅ Chấp Nhận Duyệt",
      "method": "POST",
      "url": "https://lpvn.leggett.com/api/approval/action",
      "body": "{\"taskId\":\"{{taskId}}\",\"action\":\"APPROVED\",\"token\":\"{{token}}\",\"notes\":\"{{decisionComment.value}}\"}"
    },
    {
      "type": "Action.Http",
      "title": "❌ Từ Chối",
      "method": "POST",
      "url": "https://lpvn.leggett.com/api/approval/action",
      "body": "{\"taskId\":\"{{taskId}}\",\"action\":\"REJECTED\",\"token\":\"{{token}}\",\"notes\":\"{{decisionComment.value}}\"}"
    },
    {
      "type": "Action.OpenUrl",
      "title": "🔎 Xem Chi Tiết Trên Web",
      "url": "https://lpvn.leggett.com/quick-approve?taskId={{taskId}}&token={{token}}"
    }
  ]
}
```
