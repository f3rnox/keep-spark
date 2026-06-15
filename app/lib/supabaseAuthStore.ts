import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabaseClient'
import { isSupabaseConfigured } from './isSupabaseConfigured'

export type SupabaseAuthStatus = 'loading' | 'signed-out' | 'signed-in'

export interface SupabaseAuthSnapshot {
  status: SupabaseAuthStatus
  user: User | null
}

const SERVER_SNAPSHOT: SupabaseAuthSnapshot = {
  status: 'loading',
  user: null,
}

let snapshot: SupabaseAuthSnapshot = SERVER_SNAPSHOT
let initialized: boolean = false
const listeners: Set<() => void> = new Set()

function notifyListeners(): void {
  for (const listener of listeners) listener()
}

function setSnapshot(next: SupabaseAuthSnapshot): void {
  snapshot = next
  notifyListeners()
}

/**
 * Boots Supabase auth listeners on first client access.
 */
export function initSupabaseAuth(): void {
  if (initialized || typeof window === 'undefined' || !isSupabaseConfigured()) {
    if (!isSupabaseConfigured()) {
      setSnapshot({ status: 'signed-out', user: null })
    }
    return
  }

  const supabase = getSupabaseClient()
  if (supabase === null) {
    setSnapshot({ status: 'signed-out', user: null })
    return
  }

  initialized = true

  void supabase.auth.getSession().then(({ data }): void => {
    const user: User | null = data.session?.user ?? null
    setSnapshot({
      status: user === null ? 'signed-out' : 'signed-in',
      user,
    })
  })

  supabase.auth.onAuthStateChange((_event, session): void => {
    const user: User | null = session?.user ?? null
    setSnapshot({
      status: user === null ? 'signed-out' : 'signed-in',
      user,
    })
  })
}

/**
 * Returns the current auth snapshot.
 */
export function getSupabaseAuthSnapshot(): SupabaseAuthSnapshot {
  initSupabaseAuth()
  return snapshot
}

/**
 * Returns the SSR auth snapshot.
 */
export function getSupabaseAuthServerSnapshot(): SupabaseAuthSnapshot {
  return SERVER_SNAPSHOT
}

/**
 * Subscribes to auth state changes.
 *
 * @param listener Callback invoked on every auth update.
 */
export function subscribeSupabaseAuth(listener: () => void): () => void {
  initSupabaseAuth()
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Signs in with email and password.
 *
 * @param email Account email.
 * @param password Account password.
 */
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (supabase === null) throw new Error('Supabase is not configured.')

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error !== null) throw error
}

/**
 * Creates an account with email and password.
 *
 * @param email Account email.
 * @param password Account password.
 */
export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (supabase === null) throw new Error('Supabase is not configured.')

  const { error } = await supabase.auth.signUp({ email, password })
  if (error !== null) throw error
}

/**
 * Signs the current user out.
 */
export async function signOutSupabase(): Promise<void> {
  const supabase = getSupabaseClient()
  if (supabase === null) return

  const { error } = await supabase.auth.signOut()
  if (error !== null) throw error
}
