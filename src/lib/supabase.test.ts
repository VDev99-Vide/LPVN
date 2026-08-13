import { describe, expect, it } from 'vitest'
import { supabase } from './supabase'

describe('Supabase Client', () => {
  it('initializes supabase client object properly', () => {
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
  })
})
