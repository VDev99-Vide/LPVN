import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EntraGroupRoleMappingTable } from './EntraGroupRoleMappingTable'

describe('EntraGroupRoleMappingTable', () => {
  it('renders default group mappings including LPVN_IT_Admins and LPVN_HR_Managers', () => {
    render(<EntraGroupRoleMappingTable />)

    expect(
      screen.getByText('Ánh Xạ Nhóm Bảo Mật & Phân Quyền (Group-to-Role Mapping)')
    ).toBeInTheDocument()
    expect(screen.getByText('LPVN_IT_Admins')).toBeInTheDocument()
    expect(screen.getByText('LPVN_HR_Managers')).toBeInTheDocument()
    expect(screen.getByText('LPVN_Department_Heads')).toBeInTheDocument()
  })
})
