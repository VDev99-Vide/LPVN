import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

afterEach(cleanup)

describe('DashboardPage', () => {
  it('renders heading and KPI cards', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
    expect(screen.getByText('Pending approvals')).toBeInTheDocument()
    expect(screen.getByText('Leave used')).toBeInTheDocument()
    expect(screen.getByText('Team size')).toBeInTheDocument()
    expect(screen.getByText('Requests this month')).toBeInTheDocument()
  })

  it('renders pending approvals table with status badges', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument()
    expect(screen.getByText('LV-2026-001')).toBeInTheDocument()
    expect(screen.getByText('PENDING_APPROVAL')).toHaveClass('bg-warning')
  })
})
