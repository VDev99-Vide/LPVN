import { describe, expect, it } from 'vitest'
import { attendanceService } from './attendance.service'

describe('AttendanceService', () => {
  it('exports attendanceService object with all CRUD and approval methods', () => {
    expect(attendanceService).toBeDefined()
    expect(typeof attendanceService.getAttendanceConfirmations).toBe('function')
    expect(typeof attendanceService.createAttendanceConfirmation).toBe('function')
    expect(typeof attendanceService.approveAttendanceConfirmation).toBe('function')
    expect(typeof attendanceService.rejectAttendanceConfirmation).toBe('function')
    expect(typeof attendanceService.recordAttendanceByHR).toBe('function')
  })
})
