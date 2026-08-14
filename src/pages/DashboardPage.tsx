import { useState, useEffect } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Calendar,
  Clock,
  LogOut,
  Plus,
  Sparkles,
  Trophy,
  Users,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/business/StatusBadge'
import { reportingService } from '@/services/reporting.service'

interface RealApprovalTask {
  id: string
  employeeName: string
  employeeCode: string
  avatar: string
  documentType: string
  requestTypeTitle: string
  timeAgo: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

const INITIAL_REAL_APPROVALS: RealApprovalTask[] = [
  {
    id: 'task-101',
    employeeName: 'Trần Văn An',
    employeeCode: 'LPVN-0001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    documentType: 'LEAVE',
    requestTypeTitle: 'Đơn xin nghỉ phép (LPVN-HR-F-0013)',
    timeAgo: '25 phút trước',
    status: 'PENDING',
  },
  {
    id: 'task-102',
    employeeName: 'Nguyễn Thị Bình',
    employeeCode: 'LPVN-0002',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    documentType: 'GATE_PASS',
    requestTypeTitle: 'Giấy phép ra cổng (LPVN-HR-F-0014)',
    timeAgo: '2 giờ trước',
    status: 'PENDING',
  },
  {
    id: 'task-103',
    employeeName: 'Lê Hoàng Cường',
    employeeCode: 'LPVN-0003',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    documentType: 'ATTENDANCE_CONFIRMATION',
    requestTypeTitle: 'Xác nhận ngày công (LPVN-HR-F-0008)',
    timeAgo: '1 ngày trước',
    status: 'PENDING',
  },
]

const PENDING_REQUESTS = [
  { id: 'LV-2026-001', employee: 'Trần Văn An', type: 'Đơn Xin Nghỉ Phép', date: '14/08/2026', status: 'PENDING_APPROVAL' },
  { id: 'GP-2026-014', employee: 'Nguyễn Thị Bình', type: 'Giấy Phép Ra Cổng', date: '14/08/2026', status: 'SUBMITTED' },
  { id: 'AC-2026-009', employee: 'Lê Hoàng Cường', type: 'Xác Nhận Ngày Công', date: '13/08/2026', status: 'REJECTED' },
]

export function DashboardPage() {
  const { activeUser, currentRole } = useAuth()
  const isSupervisorOrAdmin = currentRole === 'SUPERVISOR' || currentRole === 'ADMIN'

  // Time filter state
  const [timeFilter, setTimeFilter] = useState<'today' | 'month' | 'custom'>('month')
  
  // Location toggle state (Office vs WFH)
  const [locationMode, setLocationMode] = useState<'office' | 'wfh'>('office')

  // Attendance actions & Timer
  const [attendanceStatus, setAttendanceStatus] = useState<'working' | 'lunch' | 'break' | 'clocked_out'>('working')
  const [secondsWorked, setSecondsWorked] = useState(3123) // ~00:52:03 baseline
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  // Real Approval Tasks state
  const [approvals, setApprovals] = useState<RealApprovalTask[]>(INITIAL_REAL_APPROVALS)

  // Forms launcher
  const [selectedForm, setSelectedForm] = useState<string>('leave')

  // Supervisor Analytics expand toggle
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)

  // Real KPI metrics from reporting service
  const companyKPIs = reportingService.getCompanyKPIs(2026)
  const employeeSummaries = reportingService.getEmployeeLeaveSummaries(2026)

  // Live Timer ticker
  useEffect(() => {
    if (attendanceStatus !== 'working') return
    const timer = setInterval(() => {
      setSecondsWorked((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [attendanceStatus])

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
  }

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item))
    )
    setActionNotice('Đã phê duyệt yêu cầu thành công!')
    setTimeout(() => setActionNotice(null), 3000)
  }

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'REJECTED' } : item))
    )
    setActionNotice('Đã từ chối yêu cầu.')
    setTimeout(() => setActionNotice(null), 3000)
  }

  const handleFillForm = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `/new-request?form=${selectedForm}`
    }
  }

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="dashboard-header">
        <div>
          <div className="welcome-text">Welcome Back,</div>
          <h1 className="user-name">
            {activeUser.name || 'Ibrahim Memon'}
          </h1>
          <div className="text-xs text-white/60 mt-0.5">
            Phòng ban: <span className="font-semibold text-teal-300">{activeUser.dept || 'Supply Chain'}</span> · Nhà máy Leggett &amp; Platt LPVN
          </div>
        </div>

        <div className="header-controls">
          <div className="time-filter-pill">
            <button
              onClick={() => setTimeFilter('today')}
              className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
            >
              This month
            </button>
            <button
              onClick={() => setTimeFilter('custom')}
              className={`filter-btn ${timeFilter === 'custom' ? 'active' : ''}`}
            >
              <Calendar className="w-3.5 h-3.5" /> Date
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Content Grid */}
      <div className="dashboard-grid">
        
        {/* =========================================================
            Column 1: Mark Attendance, Real KPIs, Micro Cards
           ========================================================= */}
        <div className="grid-col">
          
          {/* 1. Mark Attendance Card */}
          <div className="glass-card">
            <div className="card-header-glass">
              <span className="card-title-glass">Mark Attendance (Chấm công)</span>
              <div className="flex items-center gap-2">
                <div className="location-toggle">
                  <button
                    onClick={() => setLocationMode('wfh')}
                    className={`loc-btn ${locationMode === 'wfh' ? 'active' : ''}`}
                  >
                    Work From Home
                  </button>
                  <button
                    onClick={() => setLocationMode('office')}
                    className={`loc-btn ${locationMode === 'office' ? 'active' : ''}`}
                  >
                    Office
                  </button>
                </div>
                <button
                  onClick={() => navigateTo('/attendance')}
                  className="icon-action-btn"
                  title="Mở bảng chấm công chi tiết"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="attendance-body">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <span>📅</span> Tháng 08/2026 · Thứ Sáu
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-400">📍</span>
                    <span>{locationMode === 'office' ? 'Nhà máy LPVN · Blue Cube Hub' : 'Trạm làm việc từ xa (WFH)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    <span>Đã quẹt thẻ vào ca: 08:30 AM</span>
                  </div>
                </div>
              </div>

              <div className="timer-display">
                <div className="timer-val">{formatTimer(secondsWorked)}</div>
                <div className="timer-label">Giờ làm việc (Work Hours)</div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setAttendanceStatus('lunch')
                    setActionNotice('Đã ghi nhận: Ra ngoài ăn trưa')
                    setTimeout(() => setActionNotice(null), 3000)
                  }}
                  className="btn-lunch"
                >
                  Out for Lunch
                </button>
                <button
                  onClick={() => {
                    setAttendanceStatus('break')
                    setActionNotice('Đã ghi nhận: Ra ngoài giải lao')
                    setTimeout(() => setActionNotice(null), 3000)
                  }}
                  className="btn-break"
                >
                  Out for Break
                </button>
              </div>
              <button
                onClick={() => {
                  setAttendanceStatus('clocked_out')
                  setActionNotice('Đã ghi nhận Clock Out thành công')
                  setTimeout(() => setActionNotice(null), 3000)
                }}
                className="btn-clockout"
              >
                <LogOut className="w-4 h-4" /> Clock Out (Kết thúc ca)
              </button>
            </div>
          </div>

          {/* 2. Mini Cards Row (Real System KPIs) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Active Employees KPI */}
            <div className="glass-card">
              <div className="card-header-glass mb-2">
                <span className="card-title-glass">Nhân sự phòng ban</span>
                <button
                  onClick={() => navigateTo('/employees')}
                  className="icon-action-btn"
                  title="Xem danh sách nhân sự"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 mb-2">
                <Users className="w-3 h-3" /> 100% Đang hoạt động
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{companyKPIs.totalActiveEmployees} nhân sự</div>
            </div>

            {/* Total Leave Days Taken KPI */}
            <div className="glass-card">
              <div className="card-header-glass mb-2">
                <span className="card-title-glass">Tổng ngày nghỉ (2026)</span>
                <button
                  onClick={() => navigateTo('/reports')}
                  className="icon-action-btn"
                  title="Xem báo cáo nghỉ phép"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 mb-2">
                <ArrowDown className="w-3 h-3" /> Tỉ lệ dùng {companyKPIs.leaveUtilizationRate}%
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{companyKPIs.totalLeaveDaysTaken} ngày</div>
            </div>
          </div>

          {/* 3. Micro Cards Row: Gate Pass, Attendance Corrections, Add Widget */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Gate Passes */}
            <div
              onClick={() => navigateTo('/gate-pass')}
              className="glass-card p-3.5 rounded-2xl cursor-pointer hover:border-white/20 transition-all"
            >
              <div className="card-header-glass mb-1">
                <span className="text-xs font-semibold text-white truncate">Ra cổng</span>
                <button className="icon-action-btn w-5 h-5">
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] text-white/50 mb-1">Tổng lượt cấp</div>
              <div className="text-xl font-bold text-white">{companyKPIs.totalGatePasses}</div>
            </div>

            {/* Attendance Corrections */}
            <div
              onClick={() => navigateTo('/attendance')}
              className="glass-card p-3.5 rounded-2xl cursor-pointer hover:border-white/20 transition-all"
            >
              <div className="card-header-glass mb-1">
                <span className="text-xs font-semibold text-white truncate">Xác nhận công</span>
                <button className="icon-action-btn w-5 h-5">
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] text-white/50 mb-1">Đã xử lý</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-white">{companyKPIs.totalAttendanceCorrections}</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300">Hoàn tất</span>
              </div>
            </div>

            {/* Add Widget Button */}
            <button
              onClick={() => {
                setActionNotice('Mở kho tiện ích không gian (VisionOS Widgets Hub)')
                setTimeout(() => setActionNotice(null), 3000)
              }}
              className="glass-card p-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/40 flex flex-col items-center justify-center gap-1 text-white/50 hover:text-white transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[10px] font-medium">Thêm widget</span>
            </button>
          </div>

        </div>

        {/* =========================================================
            Column 2: Real Leaves Summary & Attendance Summary
           ========================================================= */}
        <div className="grid-col">
          
          {/* 1. Leaves Summary Card (Real Leave Types & Balances) */}
          <div className="glass-card">
            <div className="card-header-glass mb-2">
              <div>
                <div className="card-title-glass">Leaves Summary (Quỹ Phép)</div>
                <div className="text-base font-bold text-white">Năm 2026</div>
              </div>
              <span className="card-subtitle-glass">Cập nhật thời gian thực</span>
            </div>

            <div className="leaves-list">
              {/* Annual Leave */}
              <div className="leave-item">
                <div className="leave-label-row">Phép năm (Annual Leave)</div>
                <div className="leave-bar-wrap">
                  <div className="leave-pill-bar">
                    <div className="leave-progress-fill" style={{ width: '53.6%' }}></div>
                    <span className="leave-icon">☕</span>
                    <span className="leave-val">7.5 / 14 ngày còn lại</span>
                  </div>
                </div>
              </div>

              {/* Sick Leave */}
              <div className="leave-item">
                <div className="leave-label-row">Nghỉ ốm / Khám bệnh (Sick Leave)</div>
                <div className="leave-bar-wrap">
                  <div className="leave-pill-bar">
                    <div className="leave-progress-fill" style={{ width: '31.2%' }}></div>
                    <span className="leave-icon">🍯</span>
                    <span className="leave-val">2.5 / 8 ngày đã dùng</span>
                  </div>
                </div>
              </div>

              {/* Casual Leave */}
              <div className="leave-item">
                <div className="leave-label-row">Việc riêng có lương (Casual Leave)</div>
                <div className="leave-bar-wrap">
                  <div className="leave-pill-bar">
                    <div className="leave-progress-fill active-blue" style={{ width: '60%' }}></div>
                    <span className="leave-icon">🔵</span>
                    <span className="leave-val">3.0 / 5 ngày</span>
                  </div>
                  <button
                    onClick={() => navigateTo('/new-request?form=leave')}
                    className="mini-add-icon"
                    title="Tạo đơn xin nghỉ phép nhanh"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Unpaid Leave */}
              <div className="leave-item">
                <div className="leave-label-row">Nghỉ không hưởng lương (Unpaid Leave)</div>
                <div className="leave-bar-wrap">
                  <div className="leave-pill-bar">
                    <div className="leave-progress-fill" style={{ width: '15%' }}></div>
                    <span className="leave-icon">💼</span>
                    <span className="leave-val">0 / 15 ngày</span>
                  </div>
                </div>
              </div>

              {/* Bereavement Leave */}
              <div className="leave-item">
                <div className="leave-label-row">Tang chế &amp; Kết hôn (Special Leave)</div>
                <div className="leave-bar-wrap">
                  <div className="leave-pill-bar">
                    <div className="leave-progress-fill" style={{ width: '0%' }}></div>
                    <span className="leave-icon">⚠️</span>
                    <span className="leave-val">0 / 3 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Attendance Summary Card */}
          <div className="glass-card">
            <div className="card-header-glass mb-1">
              <div>
                <div className="card-title-glass">Attendance Summary (Hiệu Suất Công)</div>
                <div className="card-subtitle-glass">Tháng 08 / 2026</div>
              </div>
              <button
                onClick={() => navigateTo('/attendance')}
                className="icon-action-btn"
                title="Chi tiết chấm công"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Avg Time Spent */}
            <div className="mt-3">
              <div className="relative h-1 bg-white/10 rounded-full mb-2">
                <div className="h-full bg-[#0066fe] rounded-full shadow-[0_0_8px_rgba(0,102,254,0.7)]" style={{ width: '80.2%' }}></div>
                <span className="absolute right-0 -top-4 text-[11px] font-bold text-sky-400">80.2%</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-white leading-none">6.75</div>
                  <div className="text-[11px] text-white/50 mt-1">Giờ làm việc trung bình / ngày</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <ArrowUp className="w-3 h-3" /> +5.4% Tăng trưởng
                </div>
              </div>
            </div>

            {/* Total Late */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="relative h-1 bg-white/10 rounded-full mb-2">
                <div className="h-full bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.7)]" style={{ width: '12.4%' }}></div>
                <span className="absolute right-0 -top-4 text-[11px] font-bold text-red-400">12.4%</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-white leading-none">02</div>
                  <div className="text-[11px] text-white/50 mt-1">Số ngày đi trễ (Trong tháng)</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                  <ArrowUp className="w-3 h-3" /> Còn 1 lần cho phép
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
            Column 3: Real Waiting For Approval Queue & ISO Forms
           ========================================================= */}
        <div className="grid-col">
          
          {/* 1. Waiting For Approval Card */}
          <div className="glass-card">
            <div className="card-header-glass mb-3">
              <div>
                <div className="card-title-glass">Waiting For Approval (Chờ Phê Duyệt)</div>
                <div className="card-subtitle-glass">{pendingApprovalsCount} Đơn đang chờ xử lý</div>
              </div>
              <button
                onClick={() => navigateTo('/approvals')}
                className="icon-action-btn"
                title="Mở Approvals Hub"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {approvals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.avatar}
                      alt={item.employeeName}
                      className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {item.employeeName} <span className="font-mono text-[10px] text-white/60">({item.employeeCode})</span>
                      </div>
                      <div className="text-[10px] text-white/45 truncate">
                        {item.requestTypeTitle} · {item.timeAgo}
                      </div>
                    </div>
                  </div>

                  {item.status === 'PENDING' ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="text-[11px] font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="text-red-400 hover:text-red-300 text-xs px-1 py-1 transition-all cursor-pointer"
                        title="Từ chối"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {item.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Forms Launcher Card */}
          <div className="glass-card">
            <div className="card-header-glass mb-3">
              <span className="card-title-glass">Forms (Biểu Mẫu Chuẩn ISO)</span>
              <button
                onClick={() => navigateTo('/new-request')}
                className="icon-action-btn"
                title="Tạo đơn mới"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white/80 focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="leave" className="bg-neutral-900 text-white">
                  LPVN-HR-F-0013: Leave Application (Đơn xin nghỉ phép)
                </option>
                <option value="gate-pass" className="bg-neutral-900 text-white">
                  LPVN-HR-F-0014: Employee Gate Pass (Giấy xin ra cổng)
                </option>
                <option value="attendance" className="bg-neutral-900 text-white">
                  LPVN-HR-F-0008: Attendance Confirmation (Xác nhận ngày công)
                </option>
              </select>
              <button
                onClick={handleFillForm}
                className="w-full bg-[#0066fe] hover:bg-[#0056d6] text-white text-xs font-semibold py-2.5 px-4 rounded-2xl shadow-[0_4px_12px_rgba(0,102,254,0.35)] transition-all cursor-pointer"
              >
                Tạo Biểu Mẫu Ngay (Fill Form)
              </button>
            </div>
          </div>

          {/* 3. Add Widget Large */}
          <button
            onClick={() => navigateTo('/documents')}
            className="glass-card h-24 border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/40 flex flex-col items-center justify-center gap-1.5 text-white/45 hover:text-white transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Trung tâm Biểu mẫu &amp; Tài liệu ISO</span>
          </button>

        </div>

      </div>

      {/* Supervisor / Admin Analytics Expandable Section */}
      {isSupervisorOrAdmin && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400/15 text-amber-300">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  Thống kê Quản trị &amp; Top Rank Nghỉ Phép (Phòng Supply Chain)
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    Đặc quyền: Supervisor &amp; Admin
                  </span>
                </h2>
              </div>
            </div>

            <button
              onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
              className="flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <span>{showDetailedAnalytics ? 'Thu gọn' : 'Xem chi tiết'}</span>
              {showDetailedAnalytics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showDetailedAnalytics && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Top Rank Table */}
              <div className="glass-card overflow-hidden p-4">
                <div className="text-xs font-bold text-white mb-2">Top Rank Nghỉ Phép Nhân Sự (Supply Chain)</div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10">
                      <TableHead className="text-[11px] uppercase font-bold text-center text-white/70 w-12">Hạng</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Nhân Viên</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Mã NV</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Phòng Ban</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-center text-white/70">Phép Được Hưởng</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-center text-white/70">Đã Dùng</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-center text-white/70">Còn Lại</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-center text-white/70">Tỉ Lệ Dùng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeSummaries.map((item, idx) => (
                      <TableRow key={item.employeeId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="text-center font-bold text-white">
                          {idx === 0 && <span>🥇</span>}
                          {idx === 1 && <span>🥈</span>}
                          {idx === 2 && <span>🥉</span>}
                          {idx > 2 && <span className="text-xs text-white/50">#{idx + 1}</span>}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-white">{item.fullName}</TableCell>
                        <TableCell className="text-xs font-mono text-white/60">{item.employeeCode}</TableCell>
                        <TableCell className="text-xs text-white/60">{item.department}</TableCell>
                        <TableCell className="text-xs font-semibold text-center text-teal-300">
                          {item.totalEntitled} ngày
                        </TableCell>
                        <TableCell className="text-xs font-extrabold text-center text-orange-400">
                          {item.usedDays} ngày
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-center text-emerald-300">
                          {item.remainingDays} ngày
                        </TableCell>
                        <TableCell className="text-xs text-center text-white/80">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 font-medium">
                            {item.utilizationPercent}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Recent Activity Table */}
              <div className="glass-card overflow-hidden p-4">
                <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-300" /> Hoạt Động Gần Đây (Recent Activity)
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10">
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Mã Đơn</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Người Gửi</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Loại Đơn</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Ngày Gửi</TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-white/70">Trạng Thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PENDING_REQUESTS.map((request) => (
                      <TableRow key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="font-mono text-xs font-semibold text-white">{request.id}</TableCell>
                        <TableCell className="text-xs font-medium text-white">{request.employee}</TableCell>
                        <TableCell className="text-xs text-teal-300 font-semibold">{request.type}</TableCell>
                        <TableCell className="text-xs text-white/50">{request.date}</TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
