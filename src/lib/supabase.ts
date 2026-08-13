import { createClient } from '@supabase/supabase-js'
import { env } from '@/env'
import type { Database } from '@/types/database.types'

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
