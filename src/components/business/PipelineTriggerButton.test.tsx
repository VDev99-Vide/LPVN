import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PipelineTriggerButton } from './PipelineTriggerButton'

describe('PipelineTriggerButton', () => {
  it('renders pipeline trigger button with entity type label', () => {
    render(<PipelineTriggerButton entityType="LEAVE" />)

    expect(
      screen.getByRole('button', { name: /Chạy Thử Pipeline \(LEAVE\)/i })
    ).toBeInTheDocument()
  })
})
