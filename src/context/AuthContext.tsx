'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

const IDLE_TIMEOUT_MS = 30 * 60 * 1000

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabaseRef = useRef<SupabaseClient | null>(null)

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(async () => {
      await supabaseRef.current?.auth.signOut({ scope: 'local' })
    }, IDLE_TIMEOUT_MS)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }
    supabaseRef.current = supabase

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Idle auto-logout
  useEffect(() => {
    if (!user) return
    const events = ['mousemove', 'keydown', 'touchstart', 'click']
    events.forEach((e) => window.addEventListener(e, resetIdleTimer))
    resetIdleTimer()
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [user, resetIdleTimer])

  const signInWithGoogle = useCallback(async () => {
    await supabaseRef.current?.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }, [])

  const signOut = useCallback(async () => {
    await supabaseRef.current?.auth.signOut({ scope: 'local' })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
