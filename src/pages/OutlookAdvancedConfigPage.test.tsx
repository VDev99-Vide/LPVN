import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutlookAdvancedConfigPage } from './OutlookAdvancedConfigPage'

describe('OutlookAdvancedConfigPage', () => {
  it('renders heading, capability switcher, and config button', () => {
    render(<OutlookAdvancedConfigPage />)

    expect(
      screen.getByRole('heading', { name: /Outlook Actionable Messages \(In-Email Approval\)/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cấu Hình Graph API/i })).toBeInTheDocument()
    expect(
      screen.getByText('Cơ Chế Phê Duyệt Outlook Tự Động (Capability Switcher)')
    ).toBeInTheDocument()
  })
})
