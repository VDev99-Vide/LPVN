import { describe, expect, it } from 'vitest'
import { approvalDocumentPipelineService } from './approval-document-pipeline.service'

describe('ApprovalDocumentPipelineService', () => {
  it('maps entity types to ISO template codes accurately', () => {
    expect(approvalDocumentPipelineService.getTemplateCodeForEntity('LEAVE')).toBe('LPVN-HR-F-0013')
    expect(approvalDocumentPipelineService.getTemplateCodeForEntity('GATE_PASS')).toBe('LPVN-HR-F-0014')
    expect(approvalDocumentPipelineService.getTemplateCodeForEntity('ATTENDANCE_CONFIRMATION')).toBe('LPVN-HR-F-0008')
  })

  it('exports pipeline service with runPipeline method', () => {
    expect(approvalDocumentPipelineService).toBeDefined()
    expect(typeof approvalDocumentPipelineService.runPipeline).toBe('function')
  })
})
