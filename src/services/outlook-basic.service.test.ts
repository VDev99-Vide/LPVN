import { describe, expect, it } from 'vitest'
import { outlookBasicService } from './outlook-basic.service'

describe('OutlookBasicService', () => {
  it('generates secure deep link URL with encoded parameters', () => {
    const url = outlookBasicService.generateSecureDeepLink(
      'task-123',
      'token-abc-xyz',
      'https://lpvn.leggett.com'
    )

    expect(url).toBe('https://lpvn.leggett.com/quick-approve?taskId=task-123&token=token-abc-xyz')
  })

  it('exports outlookBasicService with validation and quick decision methods', () => {
    expect(outlookBasicService).toBeDefined()
    expect(typeof outlookBasicService.validateDeepLinkToken).toBe('function')
    expect(typeof outlookBasicService.processQuickDecision).toBe('function')
  })
})
