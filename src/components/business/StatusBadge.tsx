import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground hover:bg-muted',
  SUBMITTED: 'bg-info text-info-foreground hover:bg-info',
  PENDING_APPROVAL: 'bg-warning text-warning-foreground hover:bg-warning',
  APPROVED: 'bg-success text-success-foreground hover:bg-success',
  REJECTED: 'bg-destructive text-destructive-foreground hover:bg-destructive',
  DOCUMENT_GENERATED: 'bg-primary text-primary-foreground hover:bg-primary',
  COMPLETED: 'bg-success text-success-foreground hover:bg-success',
}

const FALLBACK_STYLE = 'bg-muted text-muted-foreground hover:bg-muted'

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = STATUS_STYLES[status] ?? FALLBACK_STYLE
  return (
    <Badge className={cn(style, className)}>{status}</Badge>
  )
}
