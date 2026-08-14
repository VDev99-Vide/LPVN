import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  LeaveApplicationISO,
  GatePassISO,
  AttendanceConfirmationISO,
} from './index'

describe('ISO Document Components', () => {
  it('renders LeaveApplicationISO with standard form fields and ISO metadata', () => {
    render(
      <LeaveApplicationISO
        data={{
          document_no: 'LPVN-HR-F-0013',
          version: '1.0',
          full_name: 'Nguyen Van A',
          employee_code: 'LPVN-0001',
          department: 'IT Department',
          position: 'Software Engineer',
          leave_type: 'ANNUAL',
          total_days: 2,
          leave_from_date: '2026-08-18',
          leave_to_date: '2026-08-19',
          annual_leave_entitled: 14,
          annual_leave_applied: 2,
          annual_leave_remain: 12,
          submission_date: '2026-08-14',
          approval_date: '2026-08-14',
          manager_name: 'Aaron Zhang',
        }}
      />
    )
    expect(screen.getByText(/ĐƠN XIN NGHỈ PHÉP/i)).toBeInTheDocument()
    expect(screen.getByText(/LEAVE APPLICATION/i)).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getAllByText(/Nghỉ phép năm/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/LPVN-HR-F-0013/i)).toBeInTheDocument()
  })

  it('renders GatePassISO with standard form fields and ISO metadata', () => {
    render(
      <GatePassISO
        data={{
          document_no: 'LPVN-HR-F-0014',
          version: '1.0',
          full_name: 'Tran Thi B',
          employee_code: 'LPVN-0002',
          department: 'HR & Admin',
          reason_type: 'BUSINESS',
          from_time: '14:00',
          to_time: '17:00',
          accompanied_items: 'Laptop Dell XPS & Documents',
          day: 14,
          month: 8,
          year: 2026,
        }}
      />
    )
    expect(screen.getByText(/GIẤY PHÉP RA CỔNG/i)).toBeInTheDocument()
    expect(screen.getByText(/EMPLOYEE GATE PASS/i)).toBeInTheDocument()
    expect(screen.getByText(/Tran Thi B/i)).toBeInTheDocument()
    expect(screen.getByText('LPVN-0002')).toBeInTheDocument()
    expect(screen.getByText(/Laptop Dell XPS & Documents/i)).toBeInTheDocument()
    expect(screen.getByText(/LPVN-HR-F-0014/i)).toBeInTheDocument()
  })

  it('renders AttendanceConfirmationISO with standard form fields and ISO metadata', () => {
    render(
      <AttendanceConfirmationISO
        data={{
          document_no: 'LPVN-HR-F-0008',
          version: '1.0',
          full_name: 'Le Van C',
          employee_code: 'LPVN-0003',
          department: 'Production',
          reason: 'Lỗi đầu đọc vân tay cổng số 2',
          confirmation_date: '2026-08-14',
          from_time: '08:00',
          to_time: '17:00',
        }}
      />
    )
    expect(screen.getByText(/PHIẾU YÊU CẦU XÁC NHẬN NGÀY CÔNG/i)).toBeInTheDocument()
    expect(screen.getByText(/ATTENDANCE CONFIRMATION FORM/i)).toBeInTheDocument()
    expect(screen.getByText(/Le Van C/i)).toBeInTheDocument()
    expect(screen.getByText('LPVN-0003')).toBeInTheDocument()
    expect(screen.getByText(/Lỗi đầu đọc vân tay cổng số 2/i)).toBeInTheDocument()
    expect(screen.getByText(/LPVN-HR-F-0008/i)).toBeInTheDocument()
  })
})
