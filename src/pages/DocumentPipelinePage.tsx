import { useState } from 'react'
import { ApprovalPipelineStatusCard } from '@/components/business/ApprovalPipelineStatusCard'
import { PipelineTriggerButton } from '@/components/business/PipelineTriggerButton'
import { DocumentIntegrityVerifier } from '@/components/business/DocumentIntegrityVerifier'
import type { PipelineResult } from '@/services/approval-document-pipeline.service'
import { GitMerge } from 'lucide-react'

export function DocumentPipelinePage() {
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Giám Sát Tự Động Hóa Pipeline (Approval → Document)
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Quy trình tự động hóa 5 bước: Lấy nét ký, khóa mẫu ISO, tạo hash SHA-256, lưu trữ R2 và thông báo đa kênh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PipelineTriggerButton
            entityType="LEAVE"
            onPipelineCompleted={setPipelineResult}
          />
          <PipelineTriggerButton
            entityType="GATE_PASS"
            onPipelineCompleted={setPipelineResult}
          />
          <PipelineTriggerButton
            entityType="ATTENDANCE_CONFIRMATION"
            onPipelineCompleted={setPipelineResult}
          />
        </div>
      </div>

      {/* Pipeline Status Stepper */}
      <ApprovalPipelineStatusCard pipelineResult={pipelineResult} />

      {/* Integrity Verifier Tool */}
      <DocumentIntegrityVerifier />
    </div>
  )
}
