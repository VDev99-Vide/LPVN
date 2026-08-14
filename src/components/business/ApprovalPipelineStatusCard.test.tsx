import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ApprovalPipelineStatusCard } from './ApprovalPipelineStatusCard'

describe('ApprovalPipelineStatusCard', () => {
  it('renders pipeline progression steps and document hash summary', () => {
    render(<ApprovalPipelineStatusCard />)

    expect(
      screen.getByText('Tiến Trình Tự Động Hóa Xuất Bản (Pipeline Progression)')
    ).toBeInTheDocument()
    expect(screen.getByText(/Signature Resolution/i)).toBeInTheDocument()
    expect(screen.getByText(/Template Version Locking/i)).toBeInTheDocument()
    expect(screen.getByText(/Snapshot & SHA-256 Hashing/i)).toBeInTheDocument()
  })
})
