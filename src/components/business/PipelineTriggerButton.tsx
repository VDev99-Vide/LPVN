import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  approvalDocumentPipelineService,
  type PipelineResult,
} from '@/services/approval-document-pipeline.service'
import { Play, Loader2 } from 'lucide-react'

export interface PipelineTriggerButtonProps {
  entityType?: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
  onPipelineCompleted?: (result: PipelineResult) => void
}

export function PipelineTriggerButton({
  entityType = 'LEAVE',
  onPipelineCompleted,
}: PipelineTriggerButtonProps) {
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = async () => {
    setIsRunning(true)
    try {
      const res = await approvalDocumentPipelineService.runPipeline({
        taskId: 'task-test-' + Date.now(),
        sourceEntityType: entityType,
        sourceEntityId: 'demo-ent-' + Date.now(),
        approverId: 'demo-approver-id',
        requesterId: 'demo-requester-id',
        employeeName: 'Trần Văn An',
        employeeEmail: 'tran.an@leggett.com',
        documentData: {
          employee_name: 'Trần Văn An',
          employee_code: 'LPVN-0001',
          department: 'Phòng Kỹ Thuật',
          created_at: new Date().toISOString(),
        },
      })
      onPipelineCompleted?.(res)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleRun}
      disabled={isRunning}
      className="gap-1.5 text-xs h-8 bg-primary font-semibold"
    >
      {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
      {isRunning ? 'Đang Thực Thi Pipeline...' : `Chạy Thử Pipeline (${entityType})`}
    </Button>
  )
}
