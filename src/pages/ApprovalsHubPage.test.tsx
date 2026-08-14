import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ApprovalsHubPage } from './ApprovalsHubPage'

describe('ApprovalsHubPage', () => {
  it('renders approvals hub page heading and stat cards', () => {
    render(
      <AuthProvider>
        <ApprovalsHubPage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Trung Tâm Phê Duyệt Tập Trung/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Chờ Phê Duyệt')).toBeInTheDocument()
    expect(screen.getByText('Đã Phê Duyệt')).toBeInTheDocument()
  })
})
