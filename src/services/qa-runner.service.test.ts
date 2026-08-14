import { describe, expect, it } from 'vitest'
import { qaRunnerService } from './qa-runner.service'

describe('qaRunnerService', () => {
  it('returns list of QA test suites', () => {
    const suites = qaRunnerService.getSuites()
    expect(suites.length).toBeGreaterThanOrEqual(4)
    expect(suites.some((s) => s.id === 'E2E_HAPPY_PATH')).toBe(true)
    expect(suites.some((s) => s.id === 'E2E_REJECTION_FALLBACK')).toBe(true)
    expect(suites.some((s) => s.id === 'CROSS_ROLE_ISOLATION')).toBe(true)
    expect(suites.some((s) => s.id === 'RLS_SECURITY_MATRIX')).toBe(true)
  })

  it('runs all QA test suites and returns passing results', async () => {
    const result = await qaRunnerService.runAllSuites()
    expect(result.totalSuites).toBe(result.passedSuites)
    expect(result.passRate).toBe(100)
    expect(result.suites.every((s) => s.status === 'PASS')).toBe(true)
  })
})
