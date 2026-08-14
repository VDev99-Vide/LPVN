import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GatePassFormDrawer } from '@/components/business/GatePassFormDrawer'
import { GatePassTable } from '@/components/business/GatePassTable'
import { GatePassSecurityStation } from '@/components/business/GatePassSecurityStation'
import { GatePassPreviewModal } from '@/components/business/GatePassPreviewModal'
import { gatePassService, type GatePassWithRelations, type CreateGatePassInput } from '@/services/gate-pass.service'
import { useAuth } from '@/hooks/useAuth'
import { Plus, DoorOpen, ShieldCheck, CheckSquare, UserCheck } from 'lucide-react'

export function GatePassPage() {
  const { user } = useAuth()
  const [gatePasses, setGatePasses] = useState<GatePassWithRelations[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedPass, setSelectedPass] = useState<GatePassWithRelations | null>(null)
  const [, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const { data } = await gatePassService.getGatePasses()
    setGatePasses(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async (input: CreateGatePassInput) => {
    await gatePassService.createGatePass(input)
    loadData()
  }

  const handleApprove = async (pass: GatePassWithRelations) => {
    if (user?.id) {
      await gatePassService.approveGatePass(pass.id, user.id, 'Đã phê duyệt bởi quản lý')
      loadData()
    }
  }

  const handleReject = async (pass: GatePassWithRelations) => {
    if (user?.id) {
      await gatePassService.rejectGatePass(pass.id, user.id, 'Từ chối duyệt')
      loadData()
    }
  }

  const handleCheckOut = async (pass: GatePassWithRelations) => {
    if (user?.id) {
      await gatePassService.recordSecurityOut(
        pass.id,
        user.id,
        user.user_metadata?.full_name || 'Bảo Vệ Ca Trực'
      )
      loadData()
    }
  }

  const handleCheckIn = async (pass: GatePassWithRelations) => {
    if (user?.id) {
      await gatePassService.recordSecurityIn(
        pass.id,
        user.id,
        user.user_metadata?.full_name || 'Bảo Vệ Ca Trực'
      )
      loadData()
    }
  }

  const handleOpenISO = (pass: GatePassWithRelations) => {
    setSelectedPass(pass)
    setIsPreviewOpen(true)
  }

  // Filter subsets
  const myPasses = user?.id
    ? gatePasses.filter((p) => p.employee_id === user.id)
    : gatePasses.slice(0, 5)

  const pendingApprovals = gatePasses.filter((p) => p.status === 'PENDING_APPROVAL')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <DoorOpen className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Quản lý Giấy phép Ra cổng</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Đăng ký ra cổng, quy trình duyệt cấp quản lý và kiểm soát cổng bảo vệ (LPVN-HR-F-0014)
          </p>
        </div>

        <Button onClick={() => setIsDrawerOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Đăng Ký Ra Cổng
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="my-passes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="my-passes" className="gap-1.5 text-xs sm:text-sm">
            <UserCheck className="h-4 w-4" />
            Đơn Của Tôi
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5 text-xs sm:text-sm">
            <CheckSquare className="h-4 w-4" />
            Duyệt Đơn ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
            <ShieldCheck className="h-4 w-4" />
            Trạm Bảo Vệ
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: My Gate Passes */}
        <TabsContent value="my-passes" className="mt-4 space-y-4">
          <GatePassTable
            gatePasses={myPasses}
            onViewISO={handleOpenISO}
            showApprovalActions={false}
          />
        </TabsContent>

        {/* Tab 2: Manager Approvals */}
        <TabsContent value="approvals" className="mt-4 space-y-4">
          <GatePassTable
            gatePasses={pendingApprovals}
            onViewISO={handleOpenISO}
            onApprove={handleApprove}
            onReject={handleReject}
            showApprovalActions={true}
          />
        </TabsContent>

        {/* Tab 3: Security Station */}
        <TabsContent value="security" className="mt-4 space-y-4">
          <GatePassSecurityStation
            gatePasses={gatePasses}
            onCheckOut={handleCheckOut}
            onCheckIn={handleCheckIn}
            onViewISO={handleOpenISO}
            currentGuardName={user?.user_metadata?.full_name || 'Bảo Vệ Ca Trực'}
          />
        </TabsContent>
      </Tabs>

      {/* Creation Drawer */}
      <GatePassFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreate}
        currentUserId={user?.id || ''}
        currentUserName={user?.user_metadata?.full_name || 'Tôi'}
        currentUserCode={user?.user_metadata?.employee_code || 'LPVN-0001'}
      />

      {/* ISO Document Preview Modal */}
      <GatePassPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        gatePass={selectedPass}
      />
    </div>
  )
}
