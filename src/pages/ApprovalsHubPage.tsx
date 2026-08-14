import { useEffect, useState } from 'react'
import { UnifiedApprovalsHub } from '@/components/business/UnifiedApprovalsHub'
import { workflowService, type ApprovalTaskWithRelations } from '@/services/workflow.service'
import { useAuth } from '@/hooks/useAuth'
import { CheckSquare } from 'lucide-react'

export function ApprovalsHubPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<ApprovalTaskWithRelations[]>([])
  const [, setIsLoading] = useState(true)

  const loadTasks = async () => {
    setIsLoading(true)
    const { data } = await workflowService.getPendingTasks()
    setTasks(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleApprove = async (task: ApprovalTaskWithRelations, notes?: string) => {
    if (user?.id) {
      await workflowService.processDecision(task.id, user.id, 'APPROVED', notes)
      loadTasks()
    }
  }

  const handleReject = async (task: ApprovalTaskWithRelations, notes: string) => {
    if (user?.id) {
      await workflowService.processDecision(task.id, user.id, 'REJECTED', notes)
      loadTasks()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <CheckSquare className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Trung Tâm Phê Duyệt Tập Trung</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Hộp thư phê duyệt thống nhất dành cho Cấp Quản Lý & Ban Giám Đốc cho toàn bộ biểu mẫu ISO
        </p>
      </div>

      {/* Main Approvals Hub */}
      <UnifiedApprovalsHub
        tasks={tasks}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
