import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DoorOpen, CalendarDays, ClipboardCheck, Upload, FileText, CheckCircle2, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type RequestTabType = 'GATE_PASS' | 'LEAVE' | 'ATTENDANCE'

export function NewRequestPage() {
  const { activeUser } = useAuth()
  const [activeTab, setActiveTab] = useState<RequestTabType>('LEAVE')
  const [submitted, setSubmitted] = useState<string | null>(null)

  // Gate Pass Form State
  const [gpType, setGpType] = useState('OFFICIAL')
  const [gpDate, setGpDate] = useState('2026-08-15')
  const [gpOutTime, setGpOutTime] = useState('10:00')
  const [gpInTime, setGpInTime] = useState('14:00')
  const [gpItems, setGpItems] = useState('Laptop, thẻ nhân viên')
  const [gpReason, setGpReason] = useState('')

  // Leave Form State
  const [leaveType, setLeaveType] = useState<'ANNUAL' | 'SICK' | 'MARRIAGE' | 'BEREAVEMENT' | 'UNPAID' | 'OTHER'>('ANNUAL')
  const [leaveDays, setLeaveDays] = useState('1')
  const [leaveFrom, setLeaveFrom] = useState('2026-08-18')
  const [leaveTo, setLeaveTo] = useState('2026-08-18')
  const [leaveReason, setLeaveReason] = useState('')
  const [attachedFile, setAttachedFile] = useState<string | null>(null)
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null)

  // Attendance Form State
  const [attReason, setAttReason] = useState('FORGOT_PUNCH')
  const [attDate, setAttDate] = useState('2026-08-14')
  const [attFromTime, setAttFromTime] = useState('08:00')
  const [attToTime, setAttToTime] = useState('17:00')
  const [attExplanation, setAttExplanation] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setAttachedFile(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let reqCode = ''
    if (activeTab === 'LEAVE') reqCode = `LV-2026-${Math.floor(100 + Math.random() * 900)}`
    else if (activeTab === 'GATE_PASS') reqCode = `GP-2026-${Math.floor(100 + Math.random() * 900)}`
    else reqCode = `AC-2026-${Math.floor(100 + Math.random() * 900)}`

    setSubmitted(`Gửi đơn thành công! Mã đơn: ${reqCode}. Đang chuyển đến danh sách đơn của bạn.`)

    setTimeout(() => {
      navigateTo('/my-requests')
    }, 1200)
  }

  const requiresAttachment = leaveType !== 'ANNUAL'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Tạo Đơn Mới (Chuẩn ISO)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
              ISO 9001:2015
            </span>
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            Chọn loại biểu mẫu ISO cần nộp. Hệ thống tự động chuyển tiếp đến cấp quản lý phòng Supply Chain.
          </p>
        </div>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm font-semibold animate-in fade-in backdrop-blur-md">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{submitted}</span>
        </div>
      )}

      {/* 3 Form Tabs matching VisionOS spatial theme */}
      <div className="flex gap-2 p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/15">
        <button
          type="button"
          onClick={() => setActiveTab('GATE_PASS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'GATE_PASS'
              ? 'bg-white/20 text-white border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.3)] backdrop-blur-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <DoorOpen className="h-4 w-4" />
          <span>1. Giấy Phép Ra Cổng</span>
          <span className="text-[10px] opacity-75 font-mono">(F-0014)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('LEAVE')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'LEAVE'
              ? 'bg-white/20 text-white border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.3)] backdrop-blur-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>2. Đơn Xin Nghỉ Phép</span>
          <span className="text-[10px] opacity-75 font-mono">(F-0013)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ATTENDANCE'
              ? 'bg-white/20 text-white border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.3)] backdrop-blur-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>3. Xác Nhận Ngày Công</span>
          <span className="text-[10px] opacity-75 font-mono">(F-0008)</span>
        </button>
      </div>

      {/* Main Form Container in VisionOS Frosted Glass Card */}
      <div className="glass-card">
        <div className="card-header-glass pb-3 border-b border-white/10">
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="card-title-glass text-lg font-bold">
                {activeTab === 'GATE_PASS' && 'Giấy Phép Ra Cổng · Gate Pass (LPVN-HR-F-0014)'}
                {activeTab === 'LEAVE' && 'Đơn Xin Nghỉ Phép · Leave Application (LPVN-HR-F-0013)'}
                {activeTab === 'ATTENDANCE' && 'Phiếu Xác Nhận Ngày Công · Attendance Confirmation (LPVN-HR-F-0008)'}
              </div>
              <div className="card-subtitle-glass text-xs mt-1">
                Người làm đơn: <strong className="text-white">{activeUser.name}</strong> ({activeUser.code}) · {activeUser.dept} · {activeUser.position}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Supply Chain Hub
              </span>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. GATE PASS TAB */}
            {activeTab === 'GATE_PASS' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Loại ra cổng</Label>
                    <select
                      value={gpType}
                      onChange={(e) => setGpType(e.target.value)}
                      className="w-full text-xs h-10 px-3 rounded-2xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-white/30"
                    >
                      <option value="OFFICIAL" className="bg-[#141722] text-white">Công tác ngoài nhà máy / Official Business</option>
                      <option value="PERSONAL" className="bg-[#141722] text-white">Việc riêng ra về / Personal leave</option>
                      <option value="SICK" className="bg-[#141722] text-white">Đau ốm đột xuất về sớm / Sick</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Ngày ra cổng</Label>
                    <Input
                      type="date"
                      value={gpDate}
                      onChange={(e) => setGpDate(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Giờ dự kiến ra khỏi cổng</Label>
                    <Input
                      type="time"
                      value={gpOutTime}
                      onChange={(e) => setGpOutTime(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Giờ dự kiến quay lại (nếu có)</Label>
                    <Input
                      type="time"
                      value={gpInTime}
                      onChange={(e) => setGpInTime(e.target.value)}
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Tài liệu / Vật tư / Thiết bị mang ra</Label>
                  <Input
                    placeholder="VD: Laptop Dell, tài liệu kiểm kê kho..."
                    value={gpItems}
                    onChange={(e) => setGpItems(e.target.value)}
                    className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Lý do / Mục đích chi tiết</Label>
                  <Textarea
                    placeholder="Giải trình rõ mục đích ra cổng phục vụ công việc hoặc lý do cá nhân..."
                    value={gpReason}
                    onChange={(e) => setGpReason(e.target.value)}
                    rows={3}
                    className="text-xs rounded-2xl bg-black/40 border-white/15 text-white"
                  />
                </div>
              </div>
            )}

            {/* 2. LEAVE APPLICATION TAB */}
            {activeTab === 'LEAVE' && (
              <div className="space-y-4">
                {/* Leave Balance Notice Banner */}
                <div className="p-3.5 rounded-2xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-between text-xs text-teal-200">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-teal-300" />
                    <span>
                      Phép năm 2026: Tiêu chuẩn <strong className="text-white">{activeUser.leaveEntitled} ngày</strong> · Đã dùng <strong className="text-white">{activeUser.leaveUsed} ngày</strong> · Còn lại <strong className="text-emerald-400 font-bold">{activeUser.leaveEntitled - activeUser.leaveUsed} ngày</strong>.
                    </span>
                  </div>
                  <span className="font-semibold text-[11px] bg-black/30 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                    Supply Chain
                  </span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Lý do xin nghỉ phép / Reason for Leave</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      { key: 'ANNUAL', label: 'Nghỉ phép năm (Annual Leave)' },
                      { key: 'SICK', label: 'Nghỉ ốm / Khám bệnh (Sick Leave)' },
                      { key: 'MARRIAGE', label: 'Kết hôn (Marriage Leave)' },
                      { key: 'BEREAVEMENT', label: 'Tang gia (Bereavement)' },
                      { key: 'UNPAID', label: 'Việc riêng không lương (Unpaid)' },
                      { key: 'OTHER', label: 'Lý do khác (Others)' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                          leaveType === item.key
                            ? 'border-teal-400 bg-teal-500/20 text-white font-bold shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                            : 'border-white/10 bg-black/30 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="leaveType"
                          checked={leaveType === item.key}
                          onChange={() => setLeaveType(item.key as any)}
                          className="accent-[#0066fe]"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Số ngày nghỉ (Total Days)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={leaveDays}
                      onChange={(e) => setLeaveDays(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Từ ngày (From Date)</Label>
                    <Input
                      type="date"
                      value={leaveFrom}
                      onChange={(e) => setLeaveFrom(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Đến ngày (To Date)</Label>
                    <Input
                      type="date"
                      value={leaveTo}
                      onChange={(e) => setLeaveTo(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>
                </div>

                {/* Medical Certificate / Attachment Box for non-annual leave */}
                {requiresAttachment && (
                  <div className="p-4 rounded-2xl border border-dashed border-coral-light/40 bg-coral-dark/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-coral-light">
                      <Upload className="h-4 w-4" />
                      <span>Đính kèm Giấy tờ Y tế / Minh chứng (Bắt buộc cho nghỉ ốm &amp; lý do đặc biệt)</span>
                    </div>
                    <p className="text-[11px] text-white/60">
                      Vui lòng tải lên ảnh chụp hoặc tệp PDF của Giấy khám bệnh, Giấy ra viện hoặc Giấy đăng ký kết hôn / Giấy chứng tử.
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <label className="bg-[#0066fe] hover:bg-[#0056d6] text-white px-4 py-2 text-xs font-bold cursor-pointer rounded-2xl inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(0,102,254,0.3)] transition-all">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Chọn tệp đính kèm</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {attachedFileName && (
                        <span className="text-xs font-medium text-white flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-teal-300" />
                          {attachedFileName}
                        </span>
                      )}
                    </div>

                    {attachedFile && (
                      <div className="mt-2 max-h-32 overflow-hidden rounded-2xl border border-white/15">
                        <img src={attachedFile} alt="Preview hồ sơ" className="h-28 object-contain" />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Ghi chú &amp; Bàn giao công việc</Label>
                  <Textarea
                    placeholder="Ghi chú người tiếp nhận công việc trong thời gian nghỉ tại phòng Supply Chain..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    rows={3}
                    className="text-xs rounded-2xl bg-black/40 border-white/15 text-white"
                  />
                </div>
              </div>
            )}

            {/* 3. ATTENDANCE CONFIRMATION TAB */}
            {activeTab === 'ATTENDANCE' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Lý do điều chỉnh công</Label>
                    <select
                      value={attReason}
                      onChange={(e) => setAttReason(e.target.value)}
                      className="w-full text-xs h-10 px-3 rounded-2xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-white/30"
                    >
                      <option value="FORGOT_PUNCH" className="bg-[#141722] text-white">Quên quẹt thẻ vào / ra máy chấm công</option>
                      <option value="OFFSITE" className="bg-[#141722] text-white">Đi công tác bên ngoài nhà máy</option>
                      <option value="DEVICE_ERROR" className="bg-[#141722] text-white">Máy chấm công lỗi không nhận diện</option>
                      <option value="OTHER" className="bg-[#141722] text-white">Lý do nghiệp vụ khác</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Ngày cần xác nhận công</Label>
                    <Input
                      type="date"
                      value={attDate}
                      onChange={(e) => setAttDate(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Giờ bắt đầu làm việc</Label>
                    <Input
                      type="time"
                      value={attFromTime}
                      onChange={(e) => setAttFromTime(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-white/80">Giờ kết thúc làm việc</Label>
                    <Input
                      type="time"
                      value={attToTime}
                      onChange={(e) => setAttToTime(e.target.value)}
                      required
                      className="text-xs h-10 rounded-2xl bg-black/40 border-white/15 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-white/80">Giải trình chi tiết</Label>
                  <Textarea
                    placeholder="Giải trình cụ thể ca làm việc và nhân chứng xác nhận cùng ca tại phòng Supply Chain..."
                    value={attExplanation}
                    onChange={(e) => setAttExplanation(e.target.value)}
                    rows={3}
                    className="text-xs rounded-2xl bg-black/40 border-white/15 text-white"
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigateTo('/my-requests')}
                className="text-xs h-10 rounded-2xl px-5 font-semibold bg-white/10 hover:bg-white/20 text-white border-white/15 cursor-pointer transition-all"
              >
                Hủy bỏ
              </Button>

              <Button
                type="submit"
                className="text-xs h-10 rounded-2xl px-7 font-bold bg-[#0066fe] hover:bg-[#0056d6] text-white shadow-[0_4px_16px_rgba(0,102,254,0.4)] cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Gửi Đơn Phê Duyệt
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
