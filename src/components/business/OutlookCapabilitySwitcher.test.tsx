import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutlookCapabilitySwitcher } from './OutlookCapabilitySwitcher'

describe('OutlookCapabilitySwitcher', () => {
  it('renders capability switcher with basic and advanced mode options', () => {
    render(
      <OutlookCapabilitySwitcher
        currentMode="ADVANCED_ACTIONABLE"
        onToggleMode={vi.fn()}
      />
    )

    expect(
      screen.getByText('Cơ Chế Phê Duyệt Outlook Tự Động (Capability Switcher)')
    ).toBeInTheDocument()
    expect(screen.getByText(/1. Outlook Basic Mode/i)).toBeInTheDocument()
    expect(screen.getByText(/2. Outlook Advanced Mode/i)).toBeInTheDocument()
  })
})
