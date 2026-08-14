import type { WorkflowTransitionRow } from '@/services/workflow.service'
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react'

interface WorkflowTimelineProps {
  transitions?: WorkflowTransitionRow[]
}

export function WorkflowTimeline({ transitions = [] }: WorkflowTimelineProps) {
  if (!transitions || transitions.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic py-2">
        Chưa có lịch sử chuyển đổi trạng thái.
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-border">
      {transitions.map((t, idx) => (
        <div key={t.id || idx} className="relative flex items-start gap-3 pl-6 text-xs">
          <div className="absolute left-0 top-0.5 rounded-full bg-background ring-2 ring-border p-0.5">
            {getStatusIcon(t.to_status)}
          </div>
          <div className="flex-1 space-y-0.5 bg-muted/40 p-2.5 rounded-md border">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="font-mono text-[11px] text-muted-foreground">{t.from_status}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-semibold text-primary">{t.to_status}</span>
            </div>
            {t.reason && (
              <div className="text-muted-foreground text-[11px]">{t.reason}</div>
            )}
            <div className="text-[10px] text-muted-foreground/80 font-mono">
              {new Date(t.created_at).toLocaleString('vi-VN')}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
