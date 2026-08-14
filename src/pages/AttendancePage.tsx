import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttendanceFormDrawer } from '@/components/business/AttendanceFormDrawer'
import { AttendanceTable } from '@/components/business/AttendanceTable'
import { AttendanceHRReviewTable } from '@/components/business/AttendanceHRReviewTable'
import { AttendancePreviewModal } from '@/components/business/AttendancePreviewModal'
import { attendanceService, type AttendanceWithRelations, type CreateAttendanceInput } from '@/services/attendance.service'
import { useAuth } from '@/hooks/useAuth'
import { Plus, ClipboardCheck, CheckSquare, UserCheck, Building2 } from 'lucide-react'

export function AttendancePage() {
  const { user } = useAuth()
  const [attendances, setAttendances] = useState<AttendanceWithRelations[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceWithRelations | null>(null)
  const [, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const { data } = await attendanceService.getAttendanceConfirmations()
    setAttendances(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async (input: CreateAttendanceInput) => {
    await attendanceService.createAttendanceConfirmation(input)
    loadData()
  }

  const handleApprove = async (att: AttendanceWithRelations) => {
    if (user?.id) {
      await attendanceService.approveAttendanceConfirmation(
        att.id,
        user.id,
        'Trưởng bộ phận đã xác nhận ngày công'
      )
      loadData()
    }
  }

  const handleReject = async (att: AttendanceWithRelations) => {
    if (user?.id) {
      await attendanceService.rejectAttendanceConfirmation(
        att.id,
        user.id,
        'Không khớp lịch trình công tác'
      )
      loadData()
    }
  }

  const handleRecordHR = async (att: AttendanceWithRelations) => {
    if (user?.id) {
      await attendanceService.recordAttendanceByHR(
        att.id,
        user.id,
        'HR đã ghi nhận công vào bảng tính lương'
      )
      loadData()
    }
  }

  const handleOpenISO = (att: AttendanceWithRelations) => {
    setSelectedAttendance(att)
    setIsPreviewOpen(true)
  }

  const myRequests = user?.id
    ? attendances.filter((a) => a.employee_id === user.id)
    : attendances.slice(0, 5)

  const pendingApprovals = attendances.filter((a) => a.status === 'PENDING_APPROVAL')
  const approvedForHR = attendances.filter(
    (a) => a.status === 'APPROVED' || a.status === 'HR_RECORDED'
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Xác Nhận Ngày Công</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Đăng ký điều chỉnh công, quy trình duyệt cấp quản lý và chuyển giao chấm công HR (LPVN-HR-F-0008)
          </p>
        </div>

        <Button onClick={() => setIsDrawerOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Đăng Ký Xác Nhận Công
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="my-requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="my-requests" className="gap-1.5 text-xs sm:text-sm">
            <UserCheck className="h-4 w-4" />
            Phiếu Của Tôi
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5 text-xs sm:text-sm">
            <CheckSquare className="h-4 w-4" />
            Duyệt Phiếu ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="hr-queue" className="gap-1.5 text-xs sm:text-sm">
            <Building2 className="h-4 w-4" />
            HR Chấm Công ({approvedForHR.filter((a) => a.status === 'APPROVED').length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: My Requests */}
        <TabsContent value="my-requests" className="mt-4 space-y-4">
          <AttendanceTable
            attendances={myRequests}
            onViewISO={handleOpenISO}
            showApprovalActions={false}
          />
        </TabsContent>

        {/* Tab 2: Manager Approvals */}
        <TabsContent value="approvals" className="mt-4 space-y-4">
          <AttendanceTable
            attendances={pendingApprovals}
            onViewISO={handleOpenISO}
            onApprove={handleApprove}
            onReject={handleReject}
            showApprovalActions={true}
          />
        </TabsContent>

        {/* Tab 3: HR Queue */}
        <TabsContent value="hr-queue" className="mt-4 space-y-4">
          <AttendanceHRReviewTable
            attendances={attendances}
            onRecordHR={handleRecordHR}
            onViewISO={handleOpenISO}
          />
        </TabsContent>
      </Tabs>

      {/* Creation Drawer */}
      <AttendanceFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreate}
        currentUserId={user?.id || ''}
        currentUserName={user?.user_metadata?.full_name || 'Tôi'}
        currentUserCode={user?.user_metadata?.employee_code || 'LPVN-0001'}
      />

      {/* ISO Preview Modal */}
      <AttendancePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        attendance={selectedAttendance}
      />
    </div>
  )
}
