import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkflowTimeline } from './WorkflowTimeline'

describe('WorkflowTimeline', () => {
  it('renders timeline transitions with from_status and to_status', () => {
    const mockTransitions = [
      {
        id: 't-1',
        task_id: 'task-1',
        from_status: 'DRAFT',
        to_status: 'PENDING',
        actor_id: 'emp-1',
        reason: 'Khởi tạo luồng phê duyệt',
        created_at: '2026-08-14T00:00:00Z',
      },
      {
        id: 't-2',
        task_id: 'task-1',
        from_status: 'PENDING',
        to_status: 'APPROVED',
        actor_id: 'mgr-1',
        reason: 'Đã duyệt qua hệ thống',
        created_at: '2026-08-14T01:00:00Z',
      },
    ]

    render(<WorkflowTimeline transitions={mockTransitions} />)

    expect(screen.getByText('DRAFT')).toBeInTheDocument()
    expect(screen.getByText('APPROVED')).toBeInTheDocument()
    expect(screen.getByText('Đã duyệt qua hệ thống')).toBeInTheDocument()
  })
})
