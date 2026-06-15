'use client'

import { useSyncExternalStore } from 'react'
import {
  getSupabaseAuthServerSnapshot,
  getSupabaseAuthSnapshot,
  subscribeSupabaseAuth,
  type SupabaseAuthSnapshot,
} from './supabaseAuthStore'

/**
 * React hook exposing Supabase auth state.
 */
export function useSupabaseAuth(): SupabaseAuthSnapshot {
  return useSyncExternalStore(
    subscribeSupabaseAuth,
    getSupabaseAuthSnapshot,
    getSupabaseAuthServerSnapshot,
  )
}
