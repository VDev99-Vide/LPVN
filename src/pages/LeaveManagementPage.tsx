import { useCallback, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  LeaveBalanceCards,
} from '@/components/business/LeaveBalanceCards'
import {
  LeaveBalanceTable,
} from '@/components/business/LeaveBalanceTable'
import {
  LeaveEntitlementModal,
  type LeaveEntitlementFormData,
} from '@/components/business/LeaveEntitlementModal'
import { leaveService, type LeaveBalanceWithRelations } from '@/services/leave.service'
import { useAuth } from '@/hooks/useAuth'
import { Search } from 'lucide-react'

export function LeaveManagementPage() {
  let userId = 'emp-1'
  try {
    const auth = useAuth()
    if (auth?.user?.id) {
      userId = auth.user.id
    } else if (auth?.profile?.id) {
      userId = auth.profile.id
    }
  } catch {
    // Outside AuthProvider, fallback to default emp-1
  }

  const currentYear = new Date().getFullYear()

  const [personalBalances, setPersonalBalances] = useState<LeaveBalanceWithRelations[]>([])
  const [companyBalances, setCompanyBalances] = useState<LeaveBalanceWithRelations[]>([])
  const [loadingPersonal, setLoadingPersonal] = useState<boolean>(true)
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [selectedBalance, setSelectedBalance] = useState<LeaveBalanceWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const fetchPersonalBalances = useCallback(async () => {
    setLoadingPersonal(true)
    try {
      const res = await leaveService.getLeaveBalances(userId, currentYear)
      if (res.data) {
        setPersonalBalances(res.data)
      }
    } finally {
      setLoadingPersonal(false)
    }
  }, [userId, currentYear])

  const fetchCompanyBalances = useCallback(async () => {
    setLoadingCompany(true)
    try {
      const res = await leaveService.getAllLeaveBalances(currentYear, searchQuery)
      if (res.data) {
        setCompanyBalances(res.data)
      }
    } finally {
      setLoadingCompany(false)
    }
  }, [currentYear, searchQuery])

  useEffect(() => {
    fetchPersonalBalances()
  }, [fetchPersonalBalances])

  useEffect(() => {
    fetchCompanyBalances()
  }, [fetchCompanyBalances])

  const handleAdjustEntitlement = (balance: LeaveBalanceWithRelations) => {
    setSelectedBalance(balance)
    setIsModalOpen(true)
  }

  const handleSubmitEntitlement = async (formData: LeaveEntitlementFormData) => {
    if (!selectedBalance) return
    setIsSubmitting(true)
    try {
      const res = await leaveService.updateEntitlement({
        employee_id: selectedBalance.employee_id,
        year: selectedBalance.year || currentYear,
        base_days: formData.base_days,
        seniority_days: formData.seniority_days,
        bonus_days: formData.bonus_days,
      })
      if (!res.error) {
        setIsModalOpen(false)
        setSelectedBalance(null)
        await Promise.all([fetchCompanyBalances(), fetchPersonalBalances()])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Quản lý Nghỉ phép & Phép năm
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Theo dõi số dư phép cá nhân và quản lý quỹ phép năm công ty.
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Số Dư Phép Cá Nhân</TabsTrigger>
          <TabsTrigger value="company">Quỹ Phép Công Ty (HR)</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          {loadingPersonal ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Đang tải số dư phép cá nhân...
            </div>
          ) : (
            <LeaveBalanceCards balances={personalBalances} />
          )}
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <div className="flex items-center gap-2 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, mã NV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <LeaveBalanceTable
            balances={companyBalances}
            onAdjustEntitlement={handleAdjustEntitlement}
            loading={loadingCompany}
          />
        </TabsContent>
      </Tabs>

      <LeaveEntitlementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEntitlement}
        employeeName={selectedBalance?.employee?.full_name}
        initialData={{
          base_days: selectedBalance?.total_days || 12,
          seniority_days: 0,
          bonus_days: 0,
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
