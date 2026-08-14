export const emailTemplateService = {
  renderApprovalRequestEmail(params: {
    approverName: string
    requesterName: string
    documentType: string
    documentNo: string
    summaryDetails: string
    approvalUrl: string
  }): { subject: string; html: string } {
    const subject = `[LPVN Flow] Yêu cầu phê duyệt ${params.documentType} - ${params.requesterName}`
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f6f8;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f766e;padding:20px 24px;text-align:left;">
              <span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:0.5px;">LPVN HR FLOW SAAS</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 24px;">
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5;">Xin chào <strong>${params.approverName}</strong>,</p>
              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.5;color:#475569;">
                Bạn có một yêu cầu phê duyệt mới từ <strong>${params.requesterName}</strong> đang chờ xử lý:
              </p>
              <!-- Summary Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;border-left:4px solid #0f766e;padding:16px;margin-bottom:24px;border-radius:4px;">
                <tr>
                  <td style="font-size:13px;line-height:1.6;color:#334155;">
                    <div><strong>Loại biểu mẫu:</strong> ${params.documentType} (${params.documentNo})</div>
                    <div><strong>Người gửi:</strong> ${params.requesterName}</div>
                    <div><strong>Nội dung tóm tắt:</strong> ${params.summaryDetails}</div>
                  </td>
                </tr>
              </table>
              <!-- Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 16px 0;">
                <tr>
                  <td align="center" style="border-radius:6px;background-color:#0f766e;">
                    <a href="${params.approvalUrl}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:14px;color:#ffffff;font-weight:bold;text-decoration:none;border-radius:6px;">
                      Xem & Phê Duyệt Ngay
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.4;">
                * Liên kết trên được mã hóa với token bảo mật sử dụng 1 lần.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9;padding:16px 24px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;">
              Leggett & Platt Vietnam Co., Ltd. — Hệ Thống Phê Duyệt Quy Trình ISO Nội Bộ
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    return { subject, html }
  },

  renderDecisionResultEmail(params: {
    employeeName: string
    documentType: string
    documentNo: string
    isApproved: boolean
    notes?: string
    documentUrl: string
  }): { subject: string; html: string } {
    const statusText = params.isApproved ? 'ĐÃ ĐƯỢC PHÊ DUYỆT' : 'BỊ TỪ CHỐI'
    const statusColor = params.isApproved ? '#16a34a' : '#dc2626'
    const subject = `[LPVN Flow] Đơn ${params.documentType} (${params.documentNo}) ${statusText}`

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f6f8;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color:${statusColor};padding:18px 24px;text-align:left;">
              <span style="color:#ffffff;font-size:16px;font-weight:bold;">KẾT QUẢ XỬ LÝ ĐƠN: ${statusText}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5;">Xin chào <strong>${params.employeeName}</strong>,</p>
              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.5;color:#475569;">
                Đơn <strong>${params.documentType}</strong> (Mã: <code>${params.documentNo}</code>) của bạn đã được Quản lý xử lý.
              </p>
              ${
                params.notes
                  ? `<div style="background-color:#f8fafc;padding:12px;border-radius:4px;border-left:3px solid #cbd5e1;margin-bottom:20px;font-size:13px;color:#334155;"><strong>Ý kiến người duyệt:</strong> ${params.notes}</div>`
                  : ''
              }
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;">
                <tr>
                  <td align="center" style="border-radius:6px;background-color:#0f766e;">
                    <a href="${params.documentUrl}" target="_blank" style="display:inline-block;padding:10px 24px;font-size:13px;color:#ffffff;font-weight:bold;text-decoration:none;border-radius:6px;">
                      Xem Chi Tiết Đơn
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f1f5f9;padding:14px 24px;text-align:center;font-size:11px;color:#64748b;">
              Leggett & Platt Vietnam Co., Ltd. — Hệ Thống Phê Duyệt Quy Trình ISO Nội Bộ
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    return { subject, html }
  },

  renderDocumentReadyEmail(params: {
    employeeName: string
    documentType: string
    documentNo: string
    documentHash: string
    downloadUrl: string
  }): { subject: string; html: string } {
    const subject = `[LPVN Flow] Bản In ISO đã hoàn tất đóng dấu: ${params.documentNo}`
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f6f8;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background-color:#0f766e;padding:18px 24px;text-align:left;">
              <span style="color:#ffffff;font-size:16px;font-weight:bold;">VĂN BẢN ISO ĐÃ XUẤT BẢN THÀNH CÔNG</span>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 14px 0;font-size:14px;">Xin chào <strong>${params.employeeName}</strong>,</p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#475569;">
                Văn bản <strong>${params.documentType}</strong> (Mã: <code>${params.documentNo}</code>) đã được đóng dấu chữ ký số và lưu trữ bất biến.
              </p>
              <div style="background-color:#f8fafc;padding:12px;border-radius:4px;border:1px solid #e2e8f0;font-family:monospace;font-size:11px;color:#0f766e;word-break:break-all;margin-bottom:20px;">
                <strong>SHA-256 Checksum:</strong><br>${params.documentHash}
              </div>
              <a href="${params.downloadUrl}" target="_blank" style="display:inline-block;padding:10px 24px;background-color:#0f766e;color:#ffffff;font-weight:bold;text-decoration:none;border-radius:4px;font-size:13px;">
                Xem Bản In Chuẩn ISO
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    return { subject, html }
  },
}
