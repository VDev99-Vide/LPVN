import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { OutlookActionPage } from './OutlookActionPage'

describe('OutlookActionPage', () => {
  it('renders outlook action page heading and compatibility badge', () => {
    render(
      <AuthProvider>
        <OutlookActionPage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Cổng Phê Duyệt Nhanh Microsoft Outlook/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Microsoft 365 Outlook Basic Mode')).toBeInTheDocument()
  })
})
