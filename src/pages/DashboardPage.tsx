import { useState, useEffect } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Calendar,
  Clock,
  Glasses,
  LogOut,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserCheck,
  Wallet,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/business/StatusBadge'

interface ApprovalItem {
  id: string
  name: string
  avatar: string
  type: string
  timeAgo: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'app-1',
    name: 'Valeria Garza',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    type: 'Promotion (HR-P-02)',
    timeAgo: '24 min ago',
    status: 'PENDING',
  },
  {
    id: 'app-2',
    name: 'Marci Senter',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop',
    type: 'HR Letters (LPVN-HR-F-0008)',
    timeAgo: '1d ago',
    status: 'PENDING',
  },
  {
    id: 'app-3',
    name: 'Donal Roche',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    type: 'Leave (LPVN-HR-F-0013)',
    timeAgo: '2d ago',
    status: 'PENDING',
  },
  {
    id: 'app-4',
    name: 'Feida Varnes',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    type: 'Gate Pass (LPVN-HR-F-0014)',
    timeAgo: '5w ago',
    status: 'PENDING',
  },
]

const TOP_RANK_LEAVE = [
  { rank: 1, name: 'Nguyễn Văn A', code: 'LPVN-0231', totalDays: 4.5, annual: 2.0, sick: 2.5, unpaid: 0, status: 'Đang theo dõi' },
  { rank: 2, name: 'Phạm Thị D', code: 'LPVN-0145', totalDays: 3.0, annual: 3.0, sick: 0, unpaid: 0, status: 'Bình thường' },
  { rank: 3, name: 'Vũ Hoàng E', code: 'LPVN-0312', totalDays: 2.5, annual: 1.0, sick: 1.5, unpaid: 0, status: 'Có giấy khám' },
  { rank: 4, name: 'Lê Văn C', code: 'LPVN-0090', totalDays: 2.0, annual: 2.0, sick: 0, unpaid: 0, status: 'Bình thường' },
  { rank: 5, name: 'Đỗ Minh T', code: 'LPVN-0402', totalDays: 1.5, annual: 0.5, sick: 1.0, unpaid: 0, status: 'Có giấy khám' },
]

const PENDING_REQUESTS = [
  { id: 'LV-2026-001', employee: 'Nguyễn Văn A', type: 'Đơn Xin Nghỉ Phép', date: '10/08/2026', status: 'PENDING_APPROVAL' },
  { id: 'GP-2026-014', employee: 'Trần Thị B', type: 'Giấy Phép Ra Cổng', date: '11/08/2026', status: 'SUBMITTED' },
  { id: 'AC-2026-009', employee: 'Lê Văn C', type: 'Xác Nhận Ngày Công', date: '12/08/2026', status: 'REJECTED' },
]

export function DashboardPage() {
  const { activeUser, currentRole, switchDemoUser } = useAuth()
  const isSupervisorOrAdmin = currentRole === 'SUPERVISOR' || currentRole === 'ADMIN'

  // Time filter state
  const [timeFilter, setTimeFilter] = useState<'today' | 'month' | 'custom'>('month')
  
  // Location toggle state (Office vs WFH)
  const [locationMode, setLocationMode] = useState<'office' | 'wfh'>('office')

  // Attendance actions & Timer
  const [attendanceStatus, setAttendanceStatus] = useState<'working' | 'lunch' | 'break' | 'clocked_out'>('working')
  const [secondsWorked, setSecondsWorked] = useState(3123) // ~00:52:03 baseline
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  // Waiting for approval queue
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS)

  // Forms launcher
  const [selectedForm, setSelectedForm] = useState<string>('leave')

  // Supervisor Analytics expand toggle
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)

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
    <div className="vision-spatial-root">
      
      {/* Top Branding Bar: Transparent Leggett Logo on Top-Left + Role Switcher */}
      <div className="w-full max-w-[1360px] flex items-center justify-between py-2 px-3 mb-3 z-10">
        <div className="flex items-center gap-3">
          {/* Leggett transparent logo (isolated, no white background) */}
          <div className="h-9 flex items-center">
            <img
              src="/leggett-transparent.png"
              alt="Leggett & Platt Logo"
              className="h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] brightness-110"
              onError={(e) => {
                // Fallback to images directory if needed
                e.currentTarget.src = '/images/leggett-transparent.png'
              }}
            />
          </div>
          <div className="flex flex-col border-l border-white/20 pl-3">
            <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              LPVN Flow
              <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                visionOS
              </span>
            </span>
            <span className="text-[10px] text-white/60">Supply Chain Hub · Leggett &amp; Platt</span>
          </div>
        </div>

        {/* Demo Role Switcher Pill */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-[11px] text-white/70 font-medium">Vai trò:</span>
          <select
            value={
              currentRole === 'EMPLOYEE'
                ? 'emp1'
                : currentRole === 'TEAM_LEADER'
                  ? 'tl1'
                  : currentRole === 'SUPERVISOR'
                    ? 'sup1'
                    : 'admin'
            }
            onChange={(e) => switchDemoUser(e.target.value)}
            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="emp1" className="text-black bg-white">Nhân viên (Nguyễn Văn A)</option>
            <option value="tl1" className="text-black bg-white">Team Leader (Lê Văn C)</option>
            <option value="sup1" className="text-black bg-white">Supervisor (Trần Thị B)</option>
            <option value="admin" className="text-black bg-white">Admin (Aaron Zhang)</option>
          </select>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Spatial Workspace Shell */}
      <div className="spatial-workspace">
        
        {/* Floating Left App Dock */}
        <aside className="floating-left-dock" aria-label="Quick App Dock">
          <button
            onClick={() => navigateTo('/')}
            className="dock-icon-btn active"
            title="Vision Dashboard"
          >
            <Glasses className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateTo('/leave')}
            className="dock-icon-btn"
            title="Quản lý Phép (Wallet / Leave)"
          >
            <Wallet className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateTo('/new-request')}
            className="dock-icon-btn"
            title="Biểu mẫu ISO (Apple Forms)"
          >
            <FileText className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateTo('/documents')}
            className="dock-icon-btn"
            title="Trung tâm Tài liệu (Store)"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateTo('/new-request')}
            className="dock-icon-btn"
            title="Tạo đơn mới"
          >
            <Plus className="w-4 h-4" />
          </button>
        </aside>

        {/* Main VisionOS Glass Container */}
        <main className="vision-container">
          
          {/* Top Header */}
          <header className="dashboard-header">
            <div>
              <div className="welcome-text">Welcome Back,</div>
              <h1 className="user-name">
                {activeUser.name || 'Ibrahim Memon'}
              </h1>
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

              <div
                onClick={() => navigateTo('/signatures')}
                className="user-avatar-glass"
                title={`${activeUser.name} (${currentRole})`}
              >
                {activeUser.name ? (
                  activeUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(-2)
                    .join('')
                    .toUpperCase()
                ) : (
                  'IM'
                )}
              </div>
            </div>
          </header>

          {/* Main 3-Column Content Grid */}
          <div className="dashboard-grid">
            
            {/* =========================================================
                Column 1: Mark Attendance, Income/Expenses, Micro Cards
               ========================================================= */}
            <div className="grid-col">
              
              {/* 1. Mark Attendance Card */}
              <div className="glass-card">
                <div className="card-header-glass">
                  <span className="card-title-glass">Mark Attendance</span>
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
                      title="Mở bảng chấm công"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="attendance-body">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span>📅</span> August, Friday 14
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs text-white/60">
                      <div className="flex items-center gap-1.5">
                        <span className="text-red-400">📍</span>
                        <span>{locationMode === 'office' ? 'Blue Cube Head Office (LPVN)' : 'Home Remote Station'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        <span>You Clocked In 08:30 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="timer-display">
                    <div className="timer-val">{formatTimer(secondsWorked)}</div>
                    <div className="timer-label">Work Hours</div>
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
                    <LogOut className="w-4 h-4" /> Clock Out
                  </button>
                </div>
              </div>

              {/* 2. Mini Cards Row (Income & Expenses) */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Income / Allocation */}
                <div className="glass-card">
                  <div className="card-header-glass mb-2">
                    <span className="card-title-glass">Income</span>
                    <button
                      onClick={() => navigateTo('/reports')}
                      className="icon-action-btn"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 mb-2">
                    <ArrowUp className="w-3 h-3" /> +7.2% Higher
                  </div>
                  <div className="text-xl font-bold text-white tracking-tight">$ 12,800.00</div>
                </div>

                {/* Expenses / Operations */}
                <div className="glass-card">
                  <div className="card-header-glass mb-2">
                    <span className="card-title-glass">Expenses</span>
                    <button
                      onClick={() => navigateTo('/reports')}
                      className="icon-action-btn"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 mb-2">
                    <ArrowDown className="w-3 h-3" /> 12.2%
                  </div>
                  <div className="text-xl font-bold text-white tracking-tight">$ 2,800.00</div>
                </div>
              </div>

              {/* 3. Micro Cards Row: Messages, HR Letters, Add Widget */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Messages */}
                <div
                  onClick={() => navigateTo('/notifications')}
                  className="glass-card p-3.5 rounded-2xl cursor-pointer hover:border-white/20 transition-all"
                >
                  <div className="card-header-glass mb-1">
                    <span className="text-xs font-semibold text-white">Messag...</span>
                    <button className="icon-action-btn w-5 h-5">
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/60 mb-1">
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-white/10 text-white">+2 Unread</span>
                  </div>
                  <div className="text-xl font-bold text-white">15</div>
                </div>

                {/* HR Letters */}
                <div
                  onClick={() => navigateTo('/my-requests')}
                  className="glass-card p-3.5 rounded-2xl cursor-pointer hover:border-white/20 transition-all"
                >
                  <div className="card-header-glass mb-1">
                    <span className="text-xs font-semibold text-white truncate">HR Letters</span>
                    <button className="icon-action-btn w-5 h-5">
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[10px] text-white/50 mb-1">Status</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-white">21</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300">Approved</span>
                  </div>
                </div>

                {/* Add Widget Button */}
                <button
                  onClick={() => {
                    setActionNotice('Mở trình tùy biến Widgets')
                    setTimeout(() => setActionNotice(null), 3000)
                  }}
                  className="glass-card p-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/40 flex flex-col items-center justify-center gap-1 text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Add widget</span>
                </button>
              </div>

            </div>

            {/* =========================================================
                Column 2: Leaves Summary & Attendance Summary
               ========================================================= */}
            <div className="grid-col">
              
              {/* 1. Leaves Summary Card */}
              <div className="glass-card">
                <div className="card-header-glass mb-2">
                  <div>
                    <div className="card-title-glass">Leaves Summary</div>
                    <div className="text-base font-bold text-white">2026</div>
                  </div>
                  <span className="card-subtitle-glass">This year</span>
                </div>

                <div className="leaves-list">
                  {/* Annual Leave */}
                  <div className="leave-item">
                    <div className="leave-label-row">Annual Leave (Phép năm)</div>
                    <div className="leave-bar-wrap">
                      <div className="leave-pill-bar">
                        <div className="leave-progress-fill" style={{ width: '100%' }}></div>
                        <span className="leave-icon">☕</span>
                        <span className="leave-val">15/15</span>
                      </div>
                    </div>
                  </div>

                  {/* Unpaid Leave */}
                  <div className="leave-item">
                    <div className="leave-label-row">Unpaid Leave (Nghỉ không lương)</div>
                    <div className="leave-bar-wrap">
                      <div className="leave-pill-bar">
                        <div className="leave-progress-fill" style={{ width: '80%' }}></div>
                        <span className="leave-icon">💼</span>
                        <span className="leave-val">12/15</span>
                      </div>
                    </div>
                  </div>

                  {/* Sick Leave */}
                  <div className="leave-item">
                    <div className="leave-label-row">Sick Leave (Nghỉ ốm)</div>
                    <div className="leave-bar-wrap">
                      <div className="leave-pill-bar">
                        <div className="leave-progress-fill" style={{ width: '62%' }}></div>
                        <span className="leave-icon">🍯</span>
                        <span className="leave-val">5/8</span>
                      </div>
                    </div>
                  </div>

                  {/* Casual Leave */}
                  <div className="leave-item">
                    <div className="leave-label-row">Casual Leave (Phép đột xuất)</div>
                    <div className="leave-bar-wrap">
                      <div className="leave-pill-bar">
                        <div className="leave-progress-fill active-blue" style={{ width: '40%' }}></div>
                        <span className="leave-icon">🔵</span>
                        <span className="leave-val">2/5</span>
                      </div>
                      <button
                        onClick={() => navigateTo('/new-request?form=leave')}
                        className="mini-add-icon"
                        title="Tạo đơn xin nghỉ nhanh"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bereavement Leave */}
                  <div className="leave-item">
                    <div className="leave-label-row">Bereavement Leave (Tang chế)</div>
                    <div className="leave-bar-wrap">
                      <div className="leave-pill-bar">
                        <div className="leave-progress-fill" style={{ width: '33%' }}></div>
                        <span className="leave-icon">⚠️</span>
                        <span className="leave-val">1/3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Attendance Summary Card */}
              <div className="glass-card">
                <div className="card-header-glass mb-1">
                  <div>
                    <div className="card-title-glass">Attendance Summary</div>
                    <div className="card-subtitle-glass">This Month</div>
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
                      <div className="text-[11px] text-white/50 mt-1">Avg Time Spent Hours</div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <ArrowUp className="w-3 h-3" /> Higher
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
                      <div className="text-[11px] text-white/50 mt-1">Total Late (days)</div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-red-400">
                      <ArrowUp className="w-3 h-3" /> 1 late remaining
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* =========================================================
                Column 3: Waiting For Approval & Quick Forms
               ========================================================= */}
            <div className="grid-col">
              
              {/* 1. Waiting For Approval Card */}
              <div className="glass-card">
                <div className="card-header-glass mb-3">
                  <div>
                    <div className="card-title-glass">Waiting For Approval</div>
                    <div className="card-subtitle-glass">{pendingApprovalsCount} Pending Approvals</div>
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
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                          <div className="text-[10px] text-white/45 truncate">
                            {item.type} · {item.timeAgo}
                          </div>
                        </div>
                      </div>

                      {item.status === 'PENDING' ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="text-[11px] font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                          >
                            Approve
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
                  <span className="card-title-glass">Forms (Biểu Mẫu ISO)</span>
                  <button
                    onClick={() => navigateTo('/new-request')}
                    className="icon-action-btn"
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
                      LPVN-HR-F-0013: Leave Application (Đơn nghỉ phép)
                    </option>
                    <option value="gate-pass" className="bg-neutral-900 text-white">
                      LPVN-HR-F-0014: Employee Gate Pass (Giấy ra cổng)
                    </option>
                    <option value="attendance" className="bg-neutral-900 text-white">
                      LPVN-HR-F-0008: Attendance Confirmation (Xác nhận ngày công)
                    </option>
                  </select>
                  <button
                    onClick={handleFillForm}
                    className="w-full bg-[#0066fe] hover:bg-[#0056d6] text-white text-xs font-semibold py-2.5 px-4 rounded-2xl shadow-[0_4px_12px_rgba(0,102,254,0.35)] transition-all cursor-pointer"
                  >
                    Fill Form
                  </button>
                </div>
              </div>

              {/* 3. Add Widget Large */}
              <button
                onClick={() => {
                  setActionNotice('Mở kho tiện ích không gian (VisionOS App Store)')
                  setTimeout(() => setActionNotice(null), 3000)
                }}
                className="glass-card h-24 border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/40 flex flex-col items-center justify-center gap-1.5 text-white/45 hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs font-medium">Add widget</span>
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
                      Thống kê Quản trị &amp; Top Rank Nghỉ Phép (Supply Chain)
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
                          <TableHead className="text-[11px] uppercase font-bold text-center text-white/70">Tổng Số Ngày Nghỉ</TableHead>
                          <TableHead className="text-[11px] uppercase font-bold text-center text-white/70">Phép Năm</TableHead>
                          <TableHead className="text-[11px] uppercase font-bold text-center text-white/70">Nghỉ Ốm</TableHead>
                          <TableHead className="text-[11px] uppercase font-bold text-white/70">Ghi Chú</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {TOP_RANK_LEAVE.map((item) => (
                          <TableRow key={item.code} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="text-center font-bold text-white">
                              {item.rank === 1 && <span>🥇</span>}
                              {item.rank === 2 && <span>🥈</span>}
                              {item.rank === 3 && <span>🥉</span>}
                              {item.rank > 3 && <span className="text-xs text-white/50">#{item.rank}</span>}
                            </TableCell>
                            <TableCell className="text-xs font-bold text-white">{item.name}</TableCell>
                            <TableCell className="text-xs font-mono text-white/60">{item.code}</TableCell>
                            <TableCell className="text-xs font-extrabold text-center text-coral-light text-orange-400">
                              {item.totalDays} ngày
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-center text-teal-300">
                              {item.annual}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-center text-amber-300">
                              {item.sick}
                            </TableCell>
                            <TableCell className="text-xs text-white/60">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/80">
                                {item.status}
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
                      <Clock className="w-3.5 h-3.5 text-teal-300" /> Hoạt Động Gần Đây
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

          {/* Bottom Floating Navigation Dock */}
          <nav className="bottom-nav-dock" aria-label="Bottom Navigation">
            <button
              onClick={() => navigateTo('/')}
              className="nav-tab-btn active"
            >
              <Sparkles className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => navigateTo('/leave')}
              className="nav-tab-btn"
            >
              <Receipt className="w-4 h-4" /> Expense &amp; Leaves
            </button>
            <button
              onClick={() => navigateTo('/attendance')}
              className="nav-tab-btn"
            >
              <Clock className="w-4 h-4" /> Timesheet
            </button>
            <button
              onClick={() => navigateTo('/approvals')}
              className="nav-tab-btn"
            >
              <UserCheck className="w-4 h-4" /> Approvals
            </button>
            <button
              onClick={() => navigateTo('/settings/security')}
              className="nav-tab-btn"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>

        </main>

      </div>

      {/* Fixed Frosted Glass Bottom Badge: By Vinh © 2026 */}
      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-[11px] font-medium text-white/70 shadow-lg tracking-wider flex items-center gap-1.5 hover:text-white hover:border-white/30 transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
          <span>By Vinh © 2026</span>
        </div>
      </footer>

    </div>
  )
}
