import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EntraSettingsPage } from './EntraSettingsPage'

describe('EntraSettingsPage', () => {
  it('renders Entra settings heading and assessment card', () => {
    render(<EntraSettingsPage />)

    expect(
      screen.getByRole('heading', { name: /Tích Hợp Microsoft Entra ID \(Azure AD SSO\)/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Đánh Giá Khả Năng Tenant (Capability Assessment)')).toBeInTheDocument()
    expect(screen.getByText('Ánh Xạ Nhóm Bảo Mật & Phân Quyền (Group-to-Role Mapping)')).toBeInTheDocument()
  })
})
