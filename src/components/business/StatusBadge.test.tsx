import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

afterEach(cleanup)

describe('StatusBadge', () => {
  it.each(['DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'DOCUMENT_GENERATED', 'COMPLETED'])(
    'renders %s text for status %s',
    (status) => {
      render(<StatusBadge status={status} />)
      expect(screen.getByText(status)).toBeInTheDocument()
    },
  )

  it('maps APPROVED to success style', () => {
    render(<StatusBadge status="APPROVED" />)
    expect(screen.getByText('APPROVED')).toHaveClass('bg-success')
  })

  it('maps PENDING_APPROVAL to warning style', () => {
    render(<StatusBadge status="PENDING_APPROVAL" />)
    expect(screen.getByText('PENDING_APPROVAL')).toHaveClass('bg-warning')
  })

  it('falls back to muted for unknown status', () => {
    render(<StatusBadge status="UNKNOWN" />)
    expect(screen.getByText('UNKNOWN')).toHaveClass('bg-muted')
  })
})
