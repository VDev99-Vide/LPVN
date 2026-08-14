import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { OutlookApprovalGate } from './OutlookApprovalGate'

describe('OutlookApprovalGate', () => {
  it('renders loading or validation gate state on mount', () => {
    render(
      <AuthProvider>
        <OutlookApprovalGate taskId="test-task" token="test-token" />
      </AuthProvider>
    )

    expect(
      screen.getByText(/Đang thẩm định mã token bảo mật từ Email Outlook/i)
    ).toBeInTheDocument()
  })
})
