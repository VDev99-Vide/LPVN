import { describe, expect, it } from 'vitest'
import { gatePassService } from './gate-pass.service'

describe('GatePassService', () => {
  it('exports gatePassService object with all expected methods', () => {
    expect(gatePassService).toBeDefined()
    expect(typeof gatePassService.getGatePasses).toBe('function')
    expect(typeof gatePassService.createGatePass).toBe('function')
    expect(typeof gatePassService.approveGatePass).toBe('function')
    expect(typeof gatePassService.rejectGatePass).toBe('function')
    expect(typeof gatePassService.recordSecurityOut).toBe('function')
    expect(typeof gatePassService.recordSecurityIn).toBe('function')
  })
})
