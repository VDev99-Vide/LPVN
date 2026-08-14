import { describe, expect, it } from 'vitest'
import { securityHardeningService } from './security-hardening.service'

describe('securityHardeningService', () => {
  describe('validateRLSMatrix', () => {
    it('evaluates RLS policies for all 8 core tables', () => {
      const results = securityHardeningService.validateRLSMatrix()
      expect(results.length).toBe(8)
      expect(results.every((r) => r.status === 'PROTECTED')).toBe(true)
      expect(results.map((r) => r.tableName)).toContain('profiles')
      expect(results.map((r) => r.tableName)).toContain('leave_requests')
      expect(results.map((r) => r.tableName)).toContain('gate_pass_requests')
      expect(results.map((r) => r.tableName)).toContain('digital_signatures')
    })
  })

  describe('checkIDORAccess', () => {
    it('allows EMPLOYEE to access their own resource', () => {
      const res = securityHardeningService.checkIDORAccess({
        userId: 'user-1',
        userRole: 'EMPLOYEE',
        userDept: 'Phòng Supply Chain',
        resourceOwnerId: 'user-1',
        resourceDept: 'Phòng Supply Chain',
        action: 'READ',
      })
      expect(res.allowed).toBe(true)
    })

    it('denies EMPLOYEE from accessing another employee resource (IDOR prevention)', () => {
      const res = securityHardeningService.checkIDORAccess({
        userId: 'user-1',
        userRole: 'EMPLOYEE',
        userDept: 'Phòng Supply Chain',
        resourceOwnerId: 'user-2',
        resourceDept: 'Phòng Supply Chain',
        action: 'READ',
      })
      expect(res.allowed).toBe(false)
      expect(res.reason).toMatch(/IDOR Violation/i)
    })

    it('allows TEAM_LEADER to read resources in their own department', () => {
      const res = securityHardeningService.checkIDORAccess({
        userId: 'tl-1',
        userRole: 'TEAM_LEADER',
        userDept: 'Phòng Supply Chain',
        resourceOwnerId: 'user-2',
        resourceDept: 'Phòng Supply Chain',
        action: 'READ',
      })
      expect(res.allowed).toBe(true)
    })

    it('denies TEAM_LEADER from approving resources from another department', () => {
      const res = securityHardeningService.checkIDORAccess({
        userId: 'tl-1',
        userRole: 'TEAM_LEADER',
        userDept: 'Phòng Supply Chain',
        resourceOwnerId: 'user-99',
        resourceDept: 'Phòng Kế Toán',
        action: 'APPROVE',
      })
      expect(res.allowed).toBe(false)
      expect(res.reason).toMatch(/Department boundary mismatch/i)
    })

    it('allows ADMIN full access across departments', () => {
      const res = securityHardeningService.checkIDORAccess({
        userId: 'admin-1',
        userRole: 'ADMIN',
        userDept: 'Ban Giám Đốc',
        resourceOwnerId: 'user-99',
        resourceDept: 'Phòng Kế Toán',
        action: 'APPROVE',
      })
      expect(res.allowed).toBe(true)
    })
  })

  describe('verifyAuditLogHMAC', () => {
    it('computes and verifies HMAC integrity for an audit log entry', () => {
      const entry = {
        id: 'audit-001',
        actorId: 'user-1',
        action: 'APPROVE_LEAVE',
        targetId: 'req-123',
        timestamp: '2026-08-14T04:00:00Z',
      }
      const signature = securityHardeningService.computeAuditHMAC(entry)
      expect(signature).toBeDefined()
      expect(typeof signature).toBe('string')

      const isValid = securityHardeningService.verifyAuditHMAC(entry, signature)
      expect(isValid).toBe(true)

      // Tampered payload
      const tamperedEntry = { ...entry, action: 'DELETE_LEAVE' }
      const isTamperedValid = securityHardeningService.verifyAuditHMAC(tamperedEntry, signature)
      expect(isTamperedValid).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('strips script tags and malicious HTML entities', () => {
      const raw = '<script>alert("xss")</script>Nghỉ ốm 1 ngày'
      const clean = securityHardeningService.sanitizeInput(raw)
      expect(clean).not.toContain('<script>')
      expect(clean).toContain('Nghỉ ốm 1 ngày')
    })
  })

  describe('checkRateLimit', () => {
    it('allows requests within threshold and blocks excess requests', () => {
      const key = 'test-approval-client'
      const limit = 3
      const windowMs = 1000

      expect(securityHardeningService.checkRateLimit(key, limit, windowMs)).toBe(true)
      expect(securityHardeningService.checkRateLimit(key, limit, windowMs)).toBe(true)
      expect(securityHardeningService.checkRateLimit(key, limit, windowMs)).toBe(true)
      expect(securityHardeningService.checkRateLimit(key, limit, windowMs)).toBe(false)
    })
  })
})
