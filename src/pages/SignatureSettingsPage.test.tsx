import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { SignatureSettingsPage } from './SignatureSettingsPage'

describe('SignatureSettingsPage', () => {
  it('renders signature settings page heading and ISO preview', () => {
    render(
      <AuthProvider>
        <SignatureSettingsPage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Cài Đặt Chữ Ký Điện Tử/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Mô Phỏng Con Dấu ISO')).toBeInTheDocument()
    expect(screen.getByText('TRƯỞNG BỘ PHẬN DUYỆT')).toBeInTheDocument()
  })
})
