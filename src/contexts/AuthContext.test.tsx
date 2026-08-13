import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { supabase } from '@/lib/supabase'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function TestConsumer() {
  const { user, isLoading, signIn, signOut } = useAuth()
  return (
    <div>
      <span data-testid="loading">{isLoading ? 'Loading' : 'Ready'}</span>
      <span data-testid="user">{user ? user.email : 'No User'}</span>
      <button onClick={() => void signIn('test@example.com')}>Sign In</button>
      <button onClick={() => void signOut()}>Sign Out</button>
    </div>
  )
}

describe('AuthContext & AuthProvider', () => {
  it('renders children and provides initial auth state without crashing', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('No User')
  })

  it('throws an error if useAuth is used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within an AuthProvider')
    consoleSpy.mockRestore()
  })

  it('supports signIn and signOut methods', async () => {
    const signInSpy = vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    })
    const signOutSpy = vi.spyOn(supabase.auth, 'signOut').mockResolvedValue({
      error: null,
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready')
    })

    screen.getByText('Sign In').click()
    expect(signInSpy).toHaveBeenCalledWith({ email: 'test@example.com' })

    screen.getByText('Sign Out').click()
    expect(signOutSpy).toHaveBeenCalled()
  })
})
