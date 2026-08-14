import { describe, expect, it } from 'vitest'
import { signatureService } from './signature.service'

describe('SignatureService', () => {
  it('exports signatureService object with all expected CRUD and audit methods', () => {
    expect(signatureService).toBeDefined()
    expect(typeof signatureService.getSignatures).toBe('function')
    expect(typeof signatureService.getDefaultSignature).toBe('function')
    expect(typeof signatureService.saveSignature).toBe('function')
    expect(typeof signatureService.setDefaultSignature).toBe('function')
    expect(typeof signatureService.deleteSignature).toBe('function')
    expect(typeof signatureService.logStampEvent).toBe('function')
  })
})
