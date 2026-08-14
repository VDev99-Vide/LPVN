import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutlookCompatibilityBadge } from './OutlookCompatibilityBadge'

describe('OutlookCompatibilityBadge', () => {
  it('renders zero admin dependency architecture badges', () => {
    render(<OutlookCompatibilityBadge />)

    expect(screen.getByText('Microsoft 365 Outlook Basic Mode')).toBeInTheDocument()
    expect(screen.getByText('Zero Admin Dependency')).toBeInTheDocument()
    expect(screen.getByText('Anti-Replay Token')).toBeInTheDocument()
  })
})
