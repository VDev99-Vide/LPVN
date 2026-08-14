import React from 'react'

export interface AttendanceConfirmationData {
  document_no?: string
  version?: string
  full_name: string
  employee_code: string
  department: string
  reason: string
  confirmation_date: string
  from_time: string
  to_time: string
  submission_date?: string
  approval_date?: string
  employee_signature_url?: string
  checked_signature_url?: string
  manager_signature_url?: string
  checker_name?: string
  manager_name?: string
}

interface AttendanceConfirmationISOProps {
  data: AttendanceConfirmationData
  className?: string
  logoUrl?: string
}

export const AttendanceConfirmationISO: React.FC<AttendanceConfirmationISOProps> = ({
  data,
  className = '',
  logoUrl = '/images/leggett-logo.jpg',
}) => {
  return (
    <div
      className={`mx-auto bg-white text-black p-8 max-w-[800px] border border-neutral-300 font-sans shadow-md print:shadow-none print:border-none print:p-0 print:m-0 text-[13px] leading-tight ${className}`}
      style={{ minHeight: '900px' }}
    >
      {/* Main Container Form Border */}
      <div className="border border-black">
        {/* Header with Logo, Title & ISO Doc No */}
        <div className="flex border-b border-black">
          {/* Logo Box */}
          <div className="w-1/4 p-3 border-r border-black flex items-center justify-center">
            <img
              src={logoUrl}
              alt="Leggett & Platt Logo"
              className="max-h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          {/* Title Box */}
          <div className="w-1/2 p-3 border-r border-black text-center flex flex-col justify-center">
            <h1 className="text-base font-bold uppercase tracking-wide">
              PHIẾU YÊU CẦU XÁC NHẬN NGÀY CÔNG
            </h1>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 mt-1">
              ATTENDANCE CONFIRMATION FORM
            </h2>
          </div>

          {/* Doc No & Version Box */}
          <div className="w-1/4 p-3 text-[11px] space-y-1 flex flex-col justify-center">
            <div>
              <span className="font-semibold">Doc no.:</span>{' '}
              {data.document_no || 'LPVN-HR-F-0008'}
            </div>
            <div>
              <span className="font-semibold">Version:</span> {data.version || '1.0'}
            </div>
          </div>
        </div>

        {/* Form Fields Table */}
        <div className="divide-y divide-black text-xs">
          {/* Full Name */}
          <div className="flex items-center">
            <div className="w-1/3 p-2.5 font-bold border-r border-black">
              Họ tên / <span className="font-normal italic">Name</span>
            </div>
            <div className="w-2/3 p-2.5 font-medium underline decoration-dotted underline-offset-4">
              {data.full_name || '…………………………………………………………………'}
            </div>
          </div>

          {/* Employee Code */}
          <div className="flex items-center">
            <div className="w-1/3 p-2.5 font-bold border-r border-black">
              MSNV / <span className="font-normal italic">E.Code</span>
            </div>
            <div className="w-2/3 p-2.5 font-medium font-mono underline decoration-dotted underline-offset-4">
              {data.employee_code || '…………………………………………………………………'}
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center">
            <div className="w-1/3 p-2.5 font-bold border-r border-black">
              Bộ phận / <span className="font-normal italic">Dept.</span>
            </div>
            <div className="w-2/3 p-2.5 font-medium underline decoration-dotted underline-offset-4">
              {data.department || '…………………………………………………………………'}
            </div>
          </div>

          {/* Reason */}
          <div className="flex items-center">
            <div className="w-1/3 p-2.5 font-bold border-r border-black">
              Lý do / <span className="font-normal italic">Reason</span>
            </div>
            <div className="w-2/3 p-2.5 font-medium underline decoration-dotted underline-offset-4">
              {data.reason || '…………………………………………………………………'}
            </div>
          </div>

          {/* Confirmation Date */}
          <div className="flex items-center">
            <div className="w-1/3 p-2.5 font-bold border-r border-black">
              Ngày cần xác nhận / <span className="font-normal italic">Confirmation Date</span>
            </div>
            <div className="w-2/3 p-2.5 font-medium underline decoration-dotted underline-offset-4">
              {data.confirmation_date || '…………………………………………………………………'}
            </div>
          </div>

          {/* Time Range */}
          <div className="flex items-center">
            <div className="w-1/3 p-2.5 font-bold border-r border-black">
              Thời gian / <span className="font-normal italic">Time</span>
            </div>
            <div className="w-2/3 p-2.5 flex items-center gap-6">
              <div className="flex items-baseline gap-2">
                <span>Từ / From:</span>
                <span className="font-bold underline decoration-dotted underline-offset-4 font-mono px-1">
                  {data.from_time || '………:………'}
                </span>
                <span>(giờ)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span>Đến / To:</span>
                <span className="font-bold underline decoration-dotted underline-offset-4 font-mono px-1">
                  {data.to_time || '………:………'}
                </span>
                <span>(giờ)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Signatures Grid */}
        <div className="grid grid-cols-3 border-t border-black min-h-[170px]">
          {/* Requested By */}
          <div className="border-r border-black p-3 flex flex-col justify-between text-center">
            <div>
              <div className="font-bold">Người đề nghị</div>
              <div className="text-[11px] text-neutral-600 italic">Requested by</div>
            </div>
            <div className="h-16 flex items-center justify-center">
              {data.employee_signature_url ? (
                <img
                  src={data.employee_signature_url}
                  alt="Requester signature"
                  className="max-h-14 max-w-[120px] object-contain"
                />
              ) : (
                <span className="text-xs text-neutral-400 italic font-mono">[ Ký điện tử ]</span>
              )}
            </div>
            <div className="text-[11px]">
              Ngày / Date:{' '}
              <span className="underline decoration-dotted underline-offset-4">
                {data.submission_date || '………………'}
              </span>
            </div>
          </div>

          {/* Checked By */}
          <div className="border-r border-black p-3 flex flex-col justify-between text-center">
            <div>
              <div className="font-bold">Xác nhận bởi</div>
              <div className="text-[11px] text-neutral-600 italic">Checked by</div>
            </div>
            <div className="h-16 flex flex-col items-center justify-center">
              {data.checked_signature_url ? (
                <img
                  src={data.checked_signature_url}
                  alt="Checked by signature"
                  className="max-h-14 max-w-[120px] object-contain"
                />
              ) : data.checker_name ? (
                <span className="text-xs font-semibold text-neutral-700">{data.checker_name}</span>
              ) : (
                <span className="text-xs text-neutral-300 italic font-mono">[ Xác nhận ]</span>
              )}
            </div>
            <div className="text-[11px]">
              Ngày / Date: <span className="underline decoration-dotted underline-offset-4">………………</span>
            </div>
          </div>

          {/* Approved By */}
          <div className="p-3 flex flex-col justify-between text-center">
            <div>
              <div className="font-bold">Duyệt bởi</div>
              <div className="text-[11px] text-neutral-600 italic">Approved by</div>
            </div>
            <div className="h-16 flex flex-col items-center justify-center">
              {data.manager_signature_url ? (
                <img
                  src={data.manager_signature_url}
                  alt="Manager signature"
                  className="max-h-14 max-w-[120px] object-contain"
                />
              ) : data.approval_date ? (
                <div className="border border-green-700 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  ✓ APPROVED {data.manager_name ? `- ${data.manager_name}` : ''}
                </div>
              ) : (
                <span className="text-xs text-neutral-300 italic font-mono">[ Chờ duyệt ]</span>
              )}
            </div>
            <div className="text-[11px]">
              Ngày / Date:{' '}
              <span className="underline decoration-dotted underline-offset-4">
                {data.approval_date || '………………'}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="border-t border-black p-2.5 text-[11px] space-y-1 bg-neutral-50/70">
          <div className="font-bold">Ghi chú / Notes:</div>
          <div className="text-neutral-700">
            Sau khi Trưởng bộ phận ký duyệt Phiếu xác nhận ngày công này, thì gửi lại Phòng Nhân Sự để chấm công /{' '}
            <span className="italic">
              After approved by Department Heads, please kindly send back to HR Dept for recording your time attendance
            </span>
          </div>
        </div>
      </div>

      {/* ISO Footer Metadata */}
      <div className="flex justify-between items-center text-[10px] text-neutral-600 mt-2 px-1">
        <div>
          Creator: <span className="font-semibold">Khoi Nguyen</span> | Approver:{' '}
          <span className="font-semibold">Aaron Zhang</span>
        </div>
        <div>
          Created date: <span className="font-semibold">12-Aug-2025</span> | Approved date:{' '}
          <span className="font-semibold">12-Aug-2025</span>
        </div>
      </div>
    </div>
  )
}
