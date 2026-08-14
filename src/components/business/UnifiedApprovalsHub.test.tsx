import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UnifiedApprovalsHub } from './UnifiedApprovalsHub'
import type { ApprovalTaskWithRelations } from '@/services/workflow.service'

describe('UnifiedApprovalsHub', () => {
  it('renders summary stat cards and filter buttons', () => {
    const mockTasks: ApprovalTaskWithRelations[] = [
      {
        id: 'task-1',
        document_type: 'LEAVE',
        document_id: 'leave-1',
        document_no: 'LPVN-HR-F-0013',
        requester_id: 'emp-1',
        approver_id: 'mgr-1',
        step_order: 1,
        status: 'PENDING',
        decision_notes: null,
        decided_at: null,
        security_token: 'sec-123',
        token_expires_at: '2026-08-20T00:00:00Z',
        created_at: '2026-08-14T00:00:00Z',
        updated_at: '2026-08-14T00:00:00Z',
        requester: {
          id: 'emp-1',
          full_name: 'Nguyen Van A',
          employee_code: 'LPVN-0001',
          department_id: null,
        },
      },
    ]

    render(
      <UnifiedApprovalsHub
        tasks={mockTasks}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    )

    expect(screen.getByText('Chờ Phê Duyệt')).toBeInTheDocument()
    expect(screen.getByText('Đã Phê Duyệt')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tất Cả/i })).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
  })
})
