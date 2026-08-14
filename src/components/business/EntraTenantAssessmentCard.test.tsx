import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EntraTenantAssessmentCard } from './EntraTenantAssessmentCard'

describe('EntraTenantAssessmentCard', () => {
  it('renders tenant assessment score and configuration checks', () => {
    render(<EntraTenantAssessmentCard />)

    expect(screen.getByText('Đánh Giá Khả Năng Tenant (Capability Assessment)')).toBeInTheDocument()
    expect(screen.getByText(/Điểm Sẵn Sàng:/i)).toBeInTheDocument()
    expect(screen.getByText('Tenant ID Configuration')).toBeInTheDocument()
    expect(screen.getByText('OIDC Scopes (User.Read & GroupMember)')).toBeInTheDocument()
  })
})
