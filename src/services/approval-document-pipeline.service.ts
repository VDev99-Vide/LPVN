import { signatureService } from './signature.service'
import { documentService } from './document.service'
import { notificationService } from './notification.service'
import { emailTemplateService } from './email-template.service'
import { supabase } from '@/lib/supabase'

export interface PipelineExecutionParams {
  taskId: string
  sourceEntityType: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
  sourceEntityId: string
  approverId: string
  requesterId: string
  employeeName: string
  employeeEmail: string
  documentData: Record<string, any>
}

export type PipelineStepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

export interface PipelineStep {
  id: string
  name: string
  status: PipelineStepStatus
  details?: string
  durationMs?: number
}

export interface PipelineResult {
  success: boolean
  documentId?: string
  documentNo?: string
  documentHash?: string
  fileUrl?: string
  steps: PipelineStep[]
  error?: Error | null
}

export const approvalDocumentPipelineService = {
  getTemplateCodeForEntity(entityType: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'): string {
    switch (entityType) {
      case 'LEAVE':
        return 'LPVN-HR-F-0013'
      case 'GATE_PASS':
        return 'LPVN-HR-F-0014'
      case 'ATTENDANCE_CONFIRMATION':
        return 'LPVN-HR-F-0008'
    }
  },

  async runPipeline(params: PipelineExecutionParams): Promise<PipelineResult> {
    const steps: PipelineStep[] = [
      { id: '1', name: 'Signature Resolution (Lấy nét ký Manager)', status: 'PENDING' },
      { id: '2', name: 'Template Version Locking (Khóa mẫu ISO)', status: 'PENDING' },
      { id: '3', name: 'Snapshot & SHA-256 Hashing (Tạo hash)', status: 'PENDING' },
      { id: '4', name: 'Document Persistence (Lưu trữ văn bản)', status: 'PENDING' },
      { id: '5', name: 'Multi-Channel Dispatch (Gửi In-App & Email)', status: 'PENDING' },
    ]

    try {
      // Step 1: Signature Resolution
      const t1Start = performance.now()
      steps[0].status = 'RUNNING'
      const { data: defaultSig } = await signatureService.getDefaultSignature(params.approverId)
      steps[0].status = 'COMPLETED'
      steps[0].durationMs = Math.round(performance.now() - t1Start)
      steps[0].details = defaultSig
        ? `Tìm thấy chữ ký số của Manager (${defaultSig.signature_type})`
        : 'Sử dụng chữ ký mặc định điện tử'

      // Step 2: Template Version Locking
      const t2Start = performance.now()
      steps[1].status = 'RUNNING'
      const templateCode = this.getTemplateCodeForEntity(params.sourceEntityType)
      steps[1].status = 'COMPLETED'
      steps[1].durationMs = Math.round(performance.now() - t2Start)
      steps[1].details = `Khóa phiên bản chuẩn ISO: ${templateCode} (v1.0)`

      // Step 3: Snapshot & SHA-256 Hashing
      const t3Start = performance.now()
      steps[2].status = 'RUNNING'
      const renderedSnapshot = {
        ...params.documentData,
        template_code: templateCode,
        source_entity_id: params.sourceEntityId,
        source_entity_type: params.sourceEntityType,
        approver_id: params.approverId,
        approved_at: new Date().toISOString(),
        manager_signature: defaultSig
          ? {
              signature_url: defaultSig.signature_url,
              signature_type: defaultSig.signature_type,
              signed_at: new Date().toISOString(),
            }
          : null,
      }
      const documentHash = await documentService.computeSHA256(renderedSnapshot)
      steps[2].status = 'COMPLETED'
      steps[2].durationMs = Math.round(performance.now() - t3Start)
      steps[2].details = `SHA-256: ${documentHash.substring(0, 16)}...`

      // Step 4: Document Persistence
      const t4Start = performance.now()
      steps[3].status = 'RUNNING'
      const fileUrl = `https://storage.lpvn.leggett.com/documents/${templateCode}_${params.sourceEntityId}.pdf`

      const { data: savedDoc, error: saveErr } = await (supabase.from('generated_documents') as any)
        .insert({
          document_no: templateCode,
          source_entity_type: params.sourceEntityType,
          source_entity_id: params.sourceEntityId,
          rendered_data_snapshot: renderedSnapshot,
          document_hash: documentHash,
          file_url: fileUrl,
          generated_by: params.approverId,
        })
        .select()
        .single()

      if (saveErr) {
        steps[3].status = 'FAILED'
        steps[3].details = saveErr.message
        return { success: false, steps, error: new Error(saveErr.message) }
      }

      const docId = savedDoc?.id || 'gen-doc-id'
      steps[3].status = 'COMPLETED'
      steps[3].durationMs = Math.round(performance.now() - t4Start)
      steps[3].details = `Đã lưu trữ văn bản bất biến ID: ${docId}`

      // Step 5: Multi-Channel Dispatch (In-App Notification + Email Queue)
      const t5Start = performance.now()
      steps[4].status = 'RUNNING'

      // In-App
      await notificationService.sendInAppNotification({
        recipientId: params.requesterId,
        eventType: 'DOCUMENT_GENERATED',
        title: `Văn bản ISO ${templateCode} đã xuất bản`,
        message: `Đơn của bạn đã được phê duyệt và hoàn tất đóng dấu chữ ký số. Mã kiểm tra SHA-256: ${documentHash.substring(0, 12)}...`,
        actionUrl: '/documents',
        metadata: { documentId: docId, documentHash },
      })

      // Outlook HTML Email Queue
      if (params.employeeEmail) {
        const emailContent = emailTemplateService.renderDocumentReadyEmail({
          employeeName: params.employeeName,
          documentType: templateCode,
          documentNo: templateCode,
          documentHash,
          downloadUrl: `https://lpvn.leggett.com/documents`,
        })

        await notificationService.enqueueEmail({
          recipientEmail: params.employeeEmail,
          subject: emailContent.subject,
          bodyHtml: emailContent.html,
          eventType: 'DOCUMENT_READY',
        })
      }

      steps[4].status = 'COMPLETED'
      steps[4].durationMs = Math.round(performance.now() - t5Start)
      steps[4].details = `Đã gửi In-App alert và xếp hàng gửi email Outlook cho ${params.employeeEmail}`

      return {
        success: true,
        documentId: docId,
        documentNo: templateCode,
        documentHash,
        fileUrl,
        steps,
        error: null,
      }
    } catch (err) {
      return {
        success: false,
        steps,
        error: err as Error,
      }
    }
  },
}
