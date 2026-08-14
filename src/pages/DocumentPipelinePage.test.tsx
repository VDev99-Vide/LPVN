import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentPipelinePage } from './DocumentPipelinePage'

describe('DocumentPipelinePage', () => {
  it('renders heading and pipeline triggers', () => {
    render(<DocumentPipelinePage />)

    expect(
      screen.getByRole('heading', {
        name: /Giám Sát Tự Động Hóa Pipeline \(Approval → Document\)/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Chạy Thử Pipeline \(LEAVE\)/i })).toBeInTheDocument()
    expect(
      screen.getByText('Tiến Trình Tự Động Hóa Xuất Bản (Pipeline Progression)')
    ).toBeInTheDocument()
  })
})
