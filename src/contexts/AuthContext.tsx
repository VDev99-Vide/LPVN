import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  roles: string[]
  isLoading: boolean
  signIn: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchProfileAndRoles = async (userId: string) => {
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_roles').select('role_id, roles(code)').eq('user_id', userId),
      ])

      if (profileRes.data) {
        setProfile(profileRes.data as Profile)
      } else {
        setProfile(null)
      }

      if (rolesRes.data) {
        const extractedRoles = (rolesRes.data as Array<{ roles: { code: string } | null }>)
          .map((ur) => ur.roles?.code)
          .filter((code): code is string => typeof code === 'string')
        setRoles(extractedRoles)
      } else {
        setRoles([])
      }
    } catch (err) {
      console.error('Error fetching user profile and roles:', err)
      setProfile(null)
      setRoles([])
    }
  }

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!isMounted) return

        const currentSession = data?.session ?? null
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchProfileAndRoles(currentSession.user.id)
        }
      } catch (error) {
        console.error('Failed to get auth session:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return

      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfileAndRoles(newSession.user.id)
      } else {
        setProfile(null)
        setRoles([])
      }
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setProfile(null)
    setRoles([])
    setUser(null)
    setSession(null)
    return { error: error as Error | null }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
