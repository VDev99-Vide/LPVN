import React from 'react'

export interface LeaveApplicationData {
  document_no?: string
  version?: string
  full_name: string
  employee_code: string
  department: string
  position: string
  leave_type: 'ANNUAL' | 'MARRIAGE' | 'UNPAID' | 'SICK' | 'BEREAVEMENT' | 'OTHER' | string
  other_reason_text?: string
  total_days: number
  leave_from_date: string
  leave_to_date: string
  annual_leave_entitled?: number
  annual_leave_applied?: number
  annual_leave_remain?: number
  submission_date?: string
  approval_date?: string
  employee_signature_url?: string
  manager_signature_url?: string
  manager_name?: string
}

interface LeaveApplicationISOProps {
  data: LeaveApplicationData
  className?: string
  logoUrl?: string
}

export const LeaveApplicationISO: React.FC<LeaveApplicationISOProps> = ({
  data,
  className = '',
  logoUrl = '/images/leggett-logo.jpg',
}) => {
  const isType = (code: string) => data.leave_type?.toUpperCase() === code.toUpperCase()

  return (
    <div
      className={`mx-auto bg-white text-black p-8 max-w-[800px] border border-neutral-300 font-sans shadow-md print:shadow-none print:border-none print:p-0 print:m-0 text-[13px] leading-tight ${className}`}
      style={{ minHeight: '1050px' }}
    >
      {/* Top ISO Metadata Table */}
      <table className="w-full border-collapse border border-black text-xs mb-4">
        <tbody>
          <tr>
            <td className="border border-black p-1.5 w-1/2">
              <span className="font-semibold">Document no.:</span>{' '}
              {data.document_no || 'LPVN-HR-F-0013'}
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
          <div className="w-2/3 text-center pr-10">
            <h1 className="text-xl font-bold uppercase tracking-wide">ĐƠN XIN NGHỈ PHÉP</h1>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-800">
              LEAVE APPLICATION
            </h2>
          </div>
        </div>

        {/* Employee Basic Information */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-2.5 space-y-3">
            <div>
              <span className="font-bold">Họ và tên:</span>{' '}
              <span className="font-medium underline decoration-dotted underline-offset-4">
                {data.full_name || '………………………………………………'}
              </span>
              <div className="text-[11px] text-neutral-600 italic">Full name</div>
            </div>
            <div>
              <span className="font-bold">Mã số nhân viên:</span>{' '}
              <span className="font-medium font-mono underline decoration-dotted underline-offset-4">
                {data.employee_code || '………………………'}
              </span>
              <div className="text-[11px] text-neutral-600 italic">Employee ID</div>
            </div>
          </div>

          <div className="p-2.5 space-y-3">
            <div>
              <span className="font-bold">Bộ phận:</span>{' '}
              <span className="font-medium underline decoration-dotted underline-offset-4">
                {data.department || '………………………………………………'}
              </span>
              <div className="text-[11px] text-neutral-600 italic">Department</div>
            </div>
            <div>
              <span className="font-bold">Chức vụ:</span>{' '}
              <span className="font-medium underline decoration-dotted underline-offset-4">
                {data.position || '………………………………………………'}
              </span>
              <div className="text-[11px] text-neutral-600 italic">Position</div>
            </div>
          </div>
        </div>

        {/* Reason for Leave Section */}
        <div className="border-b border-black p-3 space-y-2">
          <div className="font-bold">
            Lý do xin nghỉ:
            <span className="text-[11px] font-normal text-neutral-600 italic ml-1">
              / Reason for leaving
            </span>
          </div>

          <div className="grid grid-cols-3 gap-y-3 pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isType('ANNUAL')}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">Nghỉ phép năm</div>
                <div className="text-[11px] text-neutral-600 italic">Annual leave</div>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isType('MARRIAGE')}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">Kết hôn</div>
                <div className="text-[11px] text-neutral-600 italic">Marriage</div>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isType('UNPAID')}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">Không lương</div>
                <div className="text-[11px] text-neutral-600 italic">Unpaid leave</div>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isType('SICK')}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">Ốm</div>
                <div className="text-[11px] text-neutral-600 italic">Sick leave</div>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isType('BEREAVEMENT')}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">Tang gia</div>
                <div className="text-[11px] text-neutral-600 italic">Bereavement</div>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isType('OTHER')}
                readOnly
                className="mt-0.5 h-4 w-4 rounded-none accent-black border-black"
              />
              <div>
                <div className="font-medium">
                  Khác{' '}
                  {isType('OTHER') && data.other_reason_text && (
                    <span className="font-normal underline">({data.other_reason_text})</span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-600 italic">Others</div>
              </div>
            </label>
          </div>
        </div>

        {/* Duration & Date Range */}
        <div className="grid grid-cols-3 border-b border-black">
          <div className="border-r border-black p-2.5">
            <span className="font-bold">Số ngày xin nghỉ:</span>{' '}
            <span className="font-bold text-base px-1">
              {data.total_days !== undefined ? data.total_days : '……'}
            </span>{' '}
            ngày
            <div className="text-[11px] text-neutral-600 italic">Total days</div>
          </div>

          <div className="border-r border-black p-2.5">
            <span className="font-bold">Nghỉ từ ngày:</span>{' '}
            <span className="font-medium underline decoration-dotted underline-offset-4">
              {data.leave_from_date || '…………………………'}
            </span>
            <div className="text-[11px] text-neutral-600 italic">Leave from date</div>
          </div>

          <div className="p-2.5">
            <span className="font-bold">Đến ngày:</span>{' '}
            <span className="font-medium underline decoration-dotted underline-offset-4">
              {data.leave_to_date || '…………………………'}
            </span>
            <div className="text-[11px] text-neutral-600 italic">To date</div>
          </div>
        </div>

        {/* Remarks for Annual Leave */}
        <div className="border-b border-black p-3 space-y-2 bg-neutral-50/50">
          <div className="text-xs font-semibold">
            Ghi chú: Điền các thông tin bên dưới nếu nghỉ phép năm
            <div className="text-[11px] font-normal text-neutral-600 italic">
              Remarks: Fill in this information below in case of using annual leave
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-1 text-xs">
            <div>
              <span>Số ngày phép năm được hưởng:</span>{' '}
              <span className="font-bold underline decoration-dotted underline-offset-4">
                {data.annual_leave_entitled !== undefined ? data.annual_leave_entitled : '……'}
              </span>
              <div className="text-[10px] text-neutral-600 italic">Annual leave entitled</div>
            </div>

            <div>
              <span>Số ngày phép năm nghỉ:</span>{' '}
              <span className="font-bold underline decoration-dotted underline-offset-4">
                {data.annual_leave_applied !== undefined ? data.annual_leave_applied : '……'}
              </span>
              <div className="text-[10px] text-neutral-600 italic">Annual leave days applied</div>
            </div>

            <div>
              <span>Số ngày phép năm còn lại:</span>{' '}
              <span className="font-bold text-primary underline decoration-dotted underline-offset-4">
                {data.annual_leave_remain !== undefined ? data.annual_leave_remain : '……'}
              </span>
              <div className="text-[10px] text-neutral-600 italic">Annual leave days remain</div>
            </div>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-2 min-h-[190px]">
          {/* Employee Signature */}
          <div className="border-r border-black p-3 flex flex-col justify-between text-center">
            <div>
              <div className="font-bold">Chữ ký người xin nghỉ</div>
              <div className="text-[11px] text-neutral-600 italic">Employee signature</div>
            </div>

            <div className="h-16 flex items-center justify-center">
              {data.employee_signature_url ? (
                <img
                  src={data.employee_signature_url}
                  alt="Employee signature"
                  className="max-h-14 max-w-[150px] object-contain"
                />
              ) : (
                <span className="text-xs text-neutral-400 italic font-mono">[ Đã ký điện tử ]</span>
              )}
            </div>

            <div className="text-xs">
              Ngày / Date:{' '}
              <span className="underline decoration-dotted underline-offset-4">
                {data.submission_date || '…………………………'}
              </span>
            </div>
          </div>

          {/* Manager Approval Signature */}
          <div className="p-3 flex flex-col justify-between text-center">
            <div>
              <div className="font-bold">Duyệt bởi cấp quản lý trực tiếp</div>
              <div className="text-[11px] text-neutral-600 italic">Approved by Manager</div>
            </div>

            <div className="h-16 flex flex-col items-center justify-center">
              {data.manager_signature_url ? (
                <img
                  src={data.manager_signature_url}
                  alt="Manager signature"
                  className="max-h-14 max-w-[150px] object-contain"
                />
              ) : data.approval_date ? (
                <div className="border border-green-700 text-green-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                  ✓ APPROVED {data.manager_name ? `- ${data.manager_name}` : ''}
                </div>
              ) : (
                <span className="text-xs text-neutral-300 italic font-mono">[ Chờ phê duyệt ]</span>
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
      </div>
    </div>
  )
}
