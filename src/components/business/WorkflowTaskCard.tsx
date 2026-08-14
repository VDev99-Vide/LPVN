import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from './StatusBadge'
import { WorkflowTimeline } from './WorkflowTimeline'
import type { ApprovalTaskWithRelations } from '@/services/workflow.service'
import { Check, X, History, FileText } from 'lucide-react'

export interface WorkflowTaskCardProps {
  task: ApprovalTaskWithRelations
  onApprove: (task: ApprovalTaskWithRelations, notes?: string) => Promise<void>
  onReject: (task: ApprovalTaskWithRelations, notes: string) => Promise<void>
  onViewSource?: (task: ApprovalTaskWithRelations) => void
}

export function WorkflowTaskCard({
  task,
  onApprove,
  onReject,
  onViewSource,
}: WorkflowTaskCardProps) {
  const [showTimeline, setShowTimeline] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const getDocTypeBadge = (type: string) => {
    switch (type) {
      case 'LEAVE':
        return <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30">Nghỉ Phép</Badge>
      case 'GATE_PASS':
        return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30">Ra Cổng</Badge>
      case 'ATTENDANCE_CONFIRMATION':
        return <Badge variant="outline" className="border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-950/30">Xác Nhận Công</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await onApprove(task, 'Đã phê duyệt qua Workflow Engine')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason) return
    setIsProcessing(true)
    try {
      await onReject(task, rejectReason)
      setIsRejecting(false)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="overflow-hidden border shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-4 space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getDocTypeBadge(task.document_type)}
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                {task.document_no}
              </span>
            </div>
            <div className="font-bold text-sm text-foreground">
              {task.requester?.full_name || 'Nhân viên'}
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              Mã NV: {task.requester?.employee_code || '—'}
            </div>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Task Details Info */}
        <div className="text-xs bg-muted/40 p-2.5 rounded-md flex justify-between items-center">
          <span className="text-muted-foreground">Thời gian tạo:</span>
          <span className="font-mono text-foreground font-medium">
            {new Date(task.created_at).toLocaleString('vi-VN')}
          </span>
        </div>

        {/* Rejection Form Input if active */}
        {isRejecting && (
          <div className="space-y-2 pt-2 border-t">
            <input
              type="text"
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs p-2 rounded-md border bg-background"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejecting(false)}
                className="h-7 text-xs"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isProcessing || !rejectReason}
                onClick={handleReject}
                className="h-7 text-xs"
              >
                Xác Nhận Từ Chối
              </Button>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-2 border-t flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTimeline(!showTimeline)}
            className="gap-1 text-xs h-8 text-muted-foreground"
          >
            <History className="h-3.5 w-3.5" />
            {showTimeline ? 'Ẩn Lịch Sử' : 'Lịch Sử'}
          </Button>

          <div className="flex items-center gap-2">
            {onViewSource && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewSource(task)}
                className="gap-1 text-xs h-8"
              >
                <FileText className="h-3.5 w-3.5" />
                Chi Tiết
              </Button>
            )}

            {task.status === 'PENDING' && !isRejecting && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRejecting(true)}
                  className="text-destructive hover:bg-destructive/10 gap-1 text-xs h-8"
                >
                  <X className="h-3.5 w-3.5" />
                  Từ Chối
                </Button>
                <Button
                  size="sm"
                  disabled={isProcessing}
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs h-8"
                >
                  <Check className="h-3.5 w-3.5" />
                  Phê Duyệt
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Timeline Audit Collapsible */}
        {showTimeline && (
          <div className="pt-3 border-t">
            <WorkflowTimeline transitions={task.transitions} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
