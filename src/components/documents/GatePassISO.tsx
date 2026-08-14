import React from 'react'

export interface GatePassData {
  document_no?: string
  version?: string
  full_name: string
  employee_code: string
  department: string
  reason_type: 'BUSINESS' | 'PERSONAL_OR_RESIGNED' | string
  other_reason_details?: string
  from_time: string
  to_time: string
  accompanied_items?: string
  date_string?: string
  day?: string | number
  month?: string | number
  year?: string | number
  submission_date?: string
  approval_date?: string
  employee_signature_url?: string
  manager_signature_url?: string
  manager_name?: string
  security_out_time?: string
  security_in_time?: string
  security_signature_url?: string
  security_notes?: string
}

interface GatePassISOProps {
  data: GatePassData
  className?: string
  logoUrl?: string
}

export const GatePassISO: React.FC<GatePassISOProps> = ({
  data,
  className = '',
  logoUrl = '/images/leggett-logo.jpg',
}) => {
  const isBusiness = data.reason_type?.toUpperCase() === 'BUSINESS'
  const isPersonal = data.reason_type?.toUpperCase() === 'PERSONAL_OR_RESIGNED'

  return (
    <div
      className={`mx-auto bg-white text-black p-6 max-w-[800px] border border-neutral-300 font-sans shadow-md print:shadow-none print:border-none print:p-0 print:m-0 text-[13px] leading-tight ${className}`}
      style={{ minHeight: '900px' }}
    >
      {/* Top ISO Metadata Table */}
      <table className="w-full border-collapse border border-black text-xs mb-3">
        <tbody>
          <tr>
            <td className="border border-black p-1.5 w-1/2">
              <span className="font-semibold">Document no.:</span>{' '}
              {data.document_no || 'LPVN-HR-F-0014'}
            </td>
            <td className="border border-black p-1.5 w-1/2">
              <span className="font-semibold">Creation date:</span> 12-Aug-2025
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1.5">
              <span className="font-semibold">Created by:</span> Nguyen Xuan Khoi
            </td>
            <td className="border border-black p-1.5">
              <span className="font-semibold">Version:</span> {data.version || '1.0'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1.5">
              <span className="font-semibold">Reviewed/Approved by:</span> Aaron Zhang
            </td>
            <td className="border border-black p-1.5">
              <span className="font-semibold">Approval date:</span> 12-Aug-2025
            </td>
          </tr>
        </tbody>
      </table>

      {/* Main Container Form Border */}
      <div className="border border-black">
        {/* Header with Logo and Title */}
        <div className="flex border-b border-black items-center p-3">
          <div className="w-1/3 flex justify-center items-center pr-2">
            <img
              src={logoUrl}
              alt="Leggett & Platt Logo"
              className="max-h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="w-2/3 text-center pr-8">
            <h1 className="text-lg font-bold uppercase tracking-wide">GIẤY PHÉP RA CỔNG</h1>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
              EMPLOYEE GATE PASS
            </h2>
          </div>
        </div>

        {/* Date Row */}
        <div className="border-b border-black p-2 text-center text-xs font-medium">
          Ngày/day <span className="font-bold underline px-1">{data.day || '……'}</span>{' '}
          Tháng/month <span className="font-bold underline px-1">{data.month || '……'}</span>{' '}
          Năm/year <span className="font-bold underline px-1">{data.year || '2026'}</span>
        </div>

        {/* Requester Info */}
        <div className="border-b border-black p-3 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold whitespace-nowrap">Họ tên / Name:</span>
            <span className="flex-1 font-medium underline decoration-dotted underline-offset-4">
              {data.full_name || '…………………………………………………………………………'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-bold whitespace-nowrap">Bộ phận / Dept.:</span>
              <span className="flex-1 font-medium underline decoration-dotted underline-offset-4">
                {data.department || '………………………………'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-bold whitespace-nowrap">MSNV / E.Code:</span>
              <span className="flex-1 font-medium font-mono underline decoration-dotted underline-offset-4">
                {data.employee_code || '………………………'}
              </span>
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="border-b border-black p-3 space-y-2">
          <div className="font-bold">Lý do / Reason:</div>
          <div className="grid grid-cols-2 gap-4 pl-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBusiness}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">Công tác</div>
                <div className="text-[11px] text-neutral-600 italic">Business</div>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPersonal}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">Việc riêng hoặc nghỉ việc ra về</div>
                <div className="text-[11px] text-neutral-600 italic">
                  Personal matter or resigned
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Time Window */}
        <div className="border-b border-black p-3 space-y-1">
          <div className="font-bold">Thời gian / Time:</div>
          <div className="flex items-center gap-6 pl-2">
            <div className="flex items-baseline gap-2">
              <span>Từ / From:</span>
              <span className="font-bold underline decoration-dotted underline-offset-4 px-1">
                {data.from_time || '………………'}
              </span>
              <span>(giờ / time)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span>Đến / To:</span>
              <span className="font-bold underline decoration-dotted underline-offset-4 px-1">
                {data.to_time || '………………'}
              </span>
              <span>(giờ / time)</span>
            </div>
          </div>
        </div>

        {/* Accompanied Items / Property */}
        <div className="border-b border-black p-3 space-y-1 min-h-[70px]">
          <div className="font-bold">
            Tài liệu, vật dụng hoặc tài sản công ty mang theo (nếu có):
            <div className="text-[11px] font-normal text-neutral-600 italic">
              Carried document or property accompanies (if any)
            </div>
          </div>
          <div className="pt-1 underline decoration-dotted underline-offset-4 text-neutral-800">
            {data.accompanied_items || '…………………………………………………………………………………………………………'}
          </div>
        </div>

        {/* Signatures Grid */}
        <div className="grid grid-cols-2 border-b border-black min-h-[160px]">
          <div className="border-r border-black p-3 flex flex-col justify-between text-center">
            <div>
              <div className="font-bold">Người đề nghị</div>
              <div className="text-[11px] text-neutral-600 italic">Requester</div>
            </div>
            <div className="h-14 flex items-center justify-center">
              {data.employee_signature_url ? (
                <img
                  src={data.employee_signature_url}
                  alt="Requester signature"
                  className="max-h-12 max-w-[140px] object-contain"
                />
              ) : (
                <span className="text-xs text-neutral-400 italic font-mono">[ Ký điện tử ]</span>
              )}
            </div>
            <div className="text-xs">
              Ngày / Date:{' '}
              <span className="underline decoration-dotted underline-offset-4">
                {data.submission_date || '…………………………'}
              </span>
            </div>
          </div>

          <div className="p-3 flex flex-col justify-between text-center">
            <div>
              <div className="font-bold">Duyệt bởi cấp quản lý</div>
              <div className="text-[11px] text-neutral-600 italic">Approved by Manager</div>
            </div>
            <div className="h-14 flex flex-col items-center justify-center">
              {data.manager_signature_url ? (
                <img
                  src={data.manager_signature_url}
                  alt="Manager signature"
                  className="max-h-12 max-w-[140px] object-contain"
                />
              ) : data.approval_date ? (
                <div className="border border-green-700 text-green-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                  ✓ APPROVED {data.manager_name ? `- ${data.manager_name}` : ''}
                </div>
              ) : (
                <span className="text-xs text-neutral-300 italic font-mono">[ Chờ duyệt ]</span>
              )}
            </div>
            <div className="text-xs">
              Ngày / Date:{' '}
              <span className="underline decoration-dotted underline-offset-4">
                {data.approval_date || '…………………………'}
              </span>
            </div>
          </div>
        </div>

        {/* Policy Notes */}
        <div className="border-b border-black p-2.5 text-[11px] space-y-1 bg-neutral-50/70">
          <div className="font-bold">Ghi chú / Notes:</div>
          <div className="text-neutral-700">
            • Bảo vệ giữ bản này và nộp lại cho Phòng Nhân sự /{' '}
            <span className="italic">Security keep this copy and send to HRD</span>
          </div>
          <div className="text-neutral-700">
            • Ngoài giờ hành chánh, cấp giám sát, trưởng ca có thẩm quyền ký duyệt /{' '}
            <span className="italic">
              Over office hours, supervisor of requester has the right to approve for this gate pass
            </span>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-3 space-y-2">
          <div className="font-bold text-xs uppercase tracking-wide">
            Phần dành cho Bảo vệ / <span className="italic">For Security use only</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs pt-1">
            <div>
              <span>Giờ ra thực tế / Actual out:</span>
              <div className="font-bold underline decoration-dotted underline-offset-4 mt-1 font-mono">
                {data.security_out_time || '…………:…………'}
              </div>
            </div>
            <div>
              <span>Giờ vào thực tế / Actual in:</span>
              <div className="font-bold underline decoration-dotted underline-offset-4 mt-1 font-mono">
                {data.security_in_time || '…………:…………'}
              </div>
            </div>
            <div>
              <span>Ký tên bảo vệ / Security:</span>
              <div className="underline decoration-dotted underline-offset-4 mt-1 italic text-neutral-400">
                {data.security_signature_url ? '[ Đã xác nhận ]' : '…………………………'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
