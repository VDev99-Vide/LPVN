import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

afterEach(cleanup)

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders a toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('adds dark class on documentElement after click', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when clicked again', async () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
