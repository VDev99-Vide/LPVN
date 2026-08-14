import { describe, expect, it } from 'vitest'
import { workflowService } from './workflow.service'

describe('WorkflowService', () => {
  it('generates cryptographic anti-replay security tokens', () => {
    const token1 = workflowService.generateSecurityToken()
    const token2 = workflowService.generateSecurityToken()
    expect(token1).toMatch(/^sec_[a-f0-9]+_[a-z0-9]+$/)
    expect(token1).not.toBe(token2)
  })

  it('exports workflowService object with all expected methods', () => {
    expect(workflowService).toBeDefined()
    expect(typeof workflowService.getPendingTasks).toBe('function')
    expect(typeof workflowService.createApprovalTask).toBe('function')
    expect(typeof workflowService.processDecision).toBe('function')
    expect(typeof workflowService.verifyAndExecuteTokenApproval).toBe('function')
  })
})
