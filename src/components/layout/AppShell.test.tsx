import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppShell } from './AppShell'

afterEach(cleanup)

describe('AppShell - Global Vision Pro Spatial Workspace', () => {
  it('renders top-right controls and pinned bottom-right Leggett logo', () => {
    render(
      <AuthProvider>
        <AppShell>
          <div>test content</div>
        </AppShell>
      </AuthProvider>
    )
    expect(screen.getByAltText('Leggett & Platt Logo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đăng xuất khỏi hệ thống/i })).toBeInTheDocument()
  })

  it('renders floating left dock with key navigation routes', () => {
    render(
      <AuthProvider>
        <AppShell>
          <div>test content</div>
        </AppShell>
      </AuthProvider>
    )
    expect(screen.getByRole('complementary', { name: 'Global Vision Pro Navigation Dock' })).toBeInTheDocument()
  })

  it('renders frosted glass footer By Vinh © 2026', () => {
    render(
      <AuthProvider>
        <AppShell>
          <div>test content</div>
        </AppShell>
      </AuthProvider>
    )
    expect(screen.getByText('By Vinh © 2026')).toBeInTheDocument()
  })

  it('renders children content inside the vision container', () => {
    render(
      <AuthProvider>
        <AppShell>
          <div data-testid="child-page">Child Page Content</div>
        </AppShell>
      </AuthProvider>
    )
    expect(screen.getByTestId('child-page')).toHaveTextContent('Child Page Content')
  })
})
