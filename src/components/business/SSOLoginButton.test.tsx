import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SSOLoginButton } from './SSOLoginButton'

describe('SSOLoginButton', () => {
  it('renders Microsoft 365 Entra ID SSO login button', () => {
    render(<SSOLoginButton />)

    expect(
      screen.getByRole('button', { name: /Đăng nhập bằng Microsoft 365 \(Entra ID\)/i })
    ).toBeInTheDocument()
  })
})
