import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WorkflowTaskCard } from './WorkflowTaskCard'
import type { ApprovalTaskWithRelations } from '@/services/workflow.service'
import { Search, Clock, CheckCircle2, XCircle, Filter } from 'lucide-react'

export interface UnifiedApprovalsHubProps {
  tasks: ApprovalTaskWithRelations[]
  onApprove: (task: ApprovalTaskWithRelations, notes?: string) => Promise<void>
  onReject: (task: ApprovalTaskWithRelations, notes: string) => Promise<void>
  onViewSource?: (task: ApprovalTaskWithRelations) => void
}

export function UnifiedApprovalsHub({
  tasks,
  onApprove,
  onReject,
  onViewSource,
}: UnifiedApprovalsHubProps) {
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length
  const approvedCount = tasks.filter((t) => t.status === 'APPROVED').length
  const rejectedCount = tasks.filter((t) => t.status === 'REJECTED').length

  const filteredTasks = tasks.filter((t) => {
    const matchesType = selectedType === 'ALL' || t.document_type === selectedType
    const s = search.toLowerCase()
    const matchesSearch =
      t.requester?.full_name?.toLowerCase().includes(s) ||
      t.requester?.employee_code?.toLowerCase().includes(s) ||
      t.document_no?.toLowerCase().includes(s)
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* 3 Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-medium">Chờ Phê Duyệt</div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {pendingCount}
              </div>
            </div>
            <Clock className="h-8 w-8 text-amber-500/50" />
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-medium">Đã Phê Duyệt</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {approvedCount}
              </div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-medium">Đã Từ Chối</div>
              <div className="text-2xl font-bold font-mono text-destructive">
                {rejectedCount}
              </div>
            </div>
            <XCircle className="h-8 w-8 text-destructive/50" />
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <Button
            variant={selectedType === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('ALL')}
            className="text-xs"
          >
            Tất Cả ({tasks.length})
          </Button>
          <Button
            variant={selectedType === 'LEAVE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('LEAVE')}
            className="text-xs"
          >
            Nghỉ Phép
          </Button>
          <Button
            variant={selectedType === 'GATE_PASS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('GATE_PASS')}
            className="text-xs"
          >
            Ra Cổng
          </Button>
          <Button
            variant={selectedType === 'ATTENDANCE_CONFIRMATION' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('ATTENDANCE_CONFIRMATION')}
            className="text-xs"
          >
            Xác Nhận Công
          </Button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên NV, mã NV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground space-y-2">
          <Filter className="h-8 w-8 mx-auto text-muted-foreground/50" />
          <div>Không có yêu cầu phê duyệt nào phù hợp.</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((t) => (
            <WorkflowTaskCard
              key={t.id}
              task={t}
              onApprove={onApprove}
              onReject={onReject}
              onViewSource={onViewSource}
            />
          ))}
        </div>
      )}
    </div>
  )
}
