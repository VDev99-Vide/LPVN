import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AppShell } from './AppShell'

afterEach(cleanup)

describe('AppShell', () => {
  it('renders sidebar navigation items', () => {
    render(<AppShell>content</AppShell>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Leave')).toBeInTheDocument()
    expect(screen.getByText('Gate Pass')).toBeInTheDocument()
    expect(screen.getByText('Attendance')).toBeInTheDocument()
    expect(screen.getByText('Employees')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('renders topbar with theme toggle and user', () => {
    render(<AppShell>content</AppShell>)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
    expect(screen.getByText('LPVN Admin')).toBeInTheDocument()
  })

  it('renders children in the content area', () => {
    render(
      <AppShell>
        <p>dashboard content</p>
      </AppShell>,
    )
    expect(screen.getByText('dashboard content')).toBeInTheDocument()
  })
})
