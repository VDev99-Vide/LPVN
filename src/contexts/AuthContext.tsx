import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']

export type AppUserRole = 'ADMIN' | 'SUPERVISOR' | 'TEAM_LEADER' | 'EMPLOYEE'

export interface DemoUserProfile {
  id: string
  code: string
  name: string
  role: AppUserRole
  dept: string
  position: string
  email: string
  managerId: string | null
  leaveEntitled: number
  leaveUsed: number
}

export const DEMO_SUPPLY_CHAIN_USERS: Record<string, DemoUserProfile> = {
  emp1: {
    id: 'emp-sc-001',
    code: 'LPVN-0231',
    name: 'Nguyễn Văn A',
    role: 'EMPLOYEE',
    dept: 'Phòng Supply Chain',
    position: 'Nhân viên Điều độ Cung ứng',
    email: 'nguyen.vana@leggett.com',
    managerId: 'tl1',
    leaveEntitled: 12,
    leaveUsed: 2,
  },
  tl1: {
    id: 'emp-sc-002',
    code: 'LPVN-0090',
    name: 'Lê Văn C',
    role: 'TEAM_LEADER',
    dept: 'Phòng Supply Chain',
    position: 'Trưởng nhóm Cung ứng & Kho',
    email: 'le.vanc@leggett.com',
    managerId: 'sup1',
    leaveEntitled: 14,
    leaveUsed: 3,
  },
  sup1: {
    id: 'emp-sc-003',
    code: 'LPVN-0187',
    name: 'Trần Thị B',
    role: 'SUPERVISOR',
    dept: 'Phòng Supply Chain',
    position: 'Giám sát Chuỗi Cung Ứng',
    email: 'tran.thib@leggett.com',
    managerId: 'admin',
    leaveEntitled: 16,
    leaveUsed: 1,
  },
  admin: {
    id: 'emp-sc-004',
    code: 'LPVN-0001',
    name: 'Aaron Zhang',
    role: 'ADMIN',
    dept: 'Ban Quản Trị & Nhân Sự',
    position: 'Tổng Quản Trị Hệ Thống',
    email: 'aaron.zhang@leggett.com',
    managerId: null,
    leaveEntitled: 16,
    leaveUsed: 0,
  },
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  roles: string[]
  currentRole: AppUserRole
  activeUser: DemoUserProfile
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password?: string) => Promise<{ error: Error | null }>
  login: (usernameOrEmail: string, password?: string) => Promise<{ success: boolean; error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  logout: () => void
  switchDemoUser: (userKey: string) => void
  setRoleOverride: (role: AppUserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthProviderProps {
  children: ReactNode
}

const SAVED_USER_KEY = 'lpvn_saved_user_key'
const AUTH_KEY = 'lpvn_is_authenticated'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [currentRole, setCurrentRole] = useState<AppUserRole>('ADMIN')
  const [activeUserKey, setActiveUserKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SAVED_USER_KEY) || 'admin'
    }
    return 'admin'
  })
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_KEY) !== 'false'
    }
    return true
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const activeUser = DEMO_SUPPLY_CHAIN_USERS[activeUserKey] || DEMO_SUPPLY_CHAIN_USERS.admin

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
        if (extractedRoles.includes('ADMIN')) setCurrentRole('ADMIN')
        else if (extractedRoles.includes('SUPERVISOR')) setCurrentRole('SUPERVISOR')
        else if (extractedRoles.includes('TEAM_LEADER') || extractedRoles.includes('MANAGER')) setCurrentRole('TEAM_LEADER')
        else setCurrentRole('EMPLOYEE')
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
        setIsLoading(true)
        const { data } = await supabase.auth.getSession()
        if (!isMounted) return

        const currentSession = data?.session ?? null
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchProfileAndRoles(currentSession.user.id)
          setIsAuthenticated(true)
          if (typeof window !== 'undefined') localStorage.setItem(AUTH_KEY, 'true')
        } else {
          setCurrentRole(activeUser.role)
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
        setIsAuthenticated(true)
        if (typeof window !== 'undefined') localStorage.setItem(AUTH_KEY, 'true')
      } else {
        setProfile(null)
        setRoles([])
        setCurrentRole(activeUser.role)
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [activeUserKey])

  const login = async (usernameOrEmail: string, _password?: string) => {
    const cleanInput = usernameOrEmail.trim().toLowerCase()
    
    // 1. Check in DEMO_SUPPLY_CHAIN_USERS by key, code, or email
    const matchingKey = Object.keys(DEMO_SUPPLY_CHAIN_USERS).find((k) => {
      const u = DEMO_SUPPLY_CHAIN_USERS[k]
      return (
        k.toLowerCase() === cleanInput ||
        u.code.toLowerCase() === cleanInput ||
        u.email.toLowerCase() === cleanInput ||
        u.name.toLowerCase().includes(cleanInput)
      )
    })

    if (matchingKey) {
      switchDemoUser(matchingKey)
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, 'true')
        localStorage.setItem(SAVED_USER_KEY, matchingKey)
      }
      return { success: true, error: null }
    }

    // 2. Query Supabase profiles table
    try {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.ilike.${cleanInput},employee_code.ilike.${cleanInput}`)
        .maybeSingle()

      if (dbProfile) {
        setProfile(dbProfile as Profile)
        setIsAuthenticated(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_KEY, 'true')
        }
        return { success: true, error: null }
      }
    } catch {
      // ignore
    }

    // Fallback: Default to admin if any credentials provided
    if (cleanInput) {
      switchDemoUser('admin')
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, 'true')
        localStorage.setItem(SAVED_USER_KEY, 'admin')
      }
      return { success: true, error: null }
    }

    return { success: false, error: new Error('Tài khoản hoặc mật khẩu không chính xác.') }
  }

  const signIn = async (email: string, _password?: string) => {
    const matchingKey = Object.keys(DEMO_SUPPLY_CHAIN_USERS).find(
      (k) => DEMO_SUPPLY_CHAIN_USERS[k].email.toLowerCase() === email.toLowerCase()
    )
    if (matchingKey) {
      switchDemoUser(matchingKey)
    }

    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setProfile(null)
    setRoles([])
    setUser(null)
    setSession(null)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'false')
    }
    return { error: error as Error | null }
  }

  const logout = () => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'false')
      window.history.pushState({}, '', '/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const switchDemoUser = (userKey: string) => {
    if (DEMO_SUPPLY_CHAIN_USERS[userKey]) {
      setActiveUserKey(userKey)
      setCurrentRole(DEMO_SUPPLY_CHAIN_USERS[userKey].role)
      if (typeof window !== 'undefined') {
        localStorage.setItem(SAVED_USER_KEY, userKey)
      }
    }
  }

  const setRoleOverride = (role: AppUserRole) => {
    setCurrentRole(role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        currentRole,
        activeUser,
        isAuthenticated,
        isLoading,
        signIn,
        login,
        signOut,
        logout,
        switchDemoUser,
        setRoleOverride,
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
