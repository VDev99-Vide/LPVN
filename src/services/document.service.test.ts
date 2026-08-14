import { describe, expect, it } from 'vitest'
import { documentService } from './document.service'

describe('DocumentService', () => {
  it('computes 64-character SHA-256 hash correctly', async () => {
    const testData = { name: 'Nguyen Van A', doc: 'LPVN-HR-F-0013' }
    const hash = await documentService.computeSHA256(testData)
    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(64)
  })

  it('exports documentService object with all expected methods', () => {
    expect(documentService).toBeDefined()
    expect(typeof documentService.getDocumentTemplates).toBe('function')
    expect(typeof documentService.getGeneratedDocuments).toBe('function')
    expect(typeof documentService.generateDocumentSnapshot).toBe('function')
    expect(typeof documentService.verifyDocumentIntegrity).toBe('function')
  })
})
