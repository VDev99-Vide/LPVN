import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GraphApiConfigModal } from './GraphApiConfigModal'

describe('GraphApiConfigModal', () => {
  it('renders modal with Tenant ID, Client ID, and Originator ID inputs', () => {
    render(<GraphApiConfigModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Cấu Hình Microsoft Graph & Originator ID')).toBeInTheDocument()
    expect(screen.getByLabelText(/Tenant ID/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Actionable Email Originator ID/i)).toBeInTheDocument()
  })
})
