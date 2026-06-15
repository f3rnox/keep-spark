'use client'

import { useSyncExternalStore } from 'react'
import {
  getSupabaseSyncServerSnapshot,
  getSupabaseSyncSnapshot,
  subscribeSupabaseSync,
  type SupabaseSyncSnapshot,
} from './supabaseSyncStore'

/**
 * React hook exposing Supabase sync status.
 */
export function useSupabaseSync(): SupabaseSyncSnapshot {
  return useSyncExternalStore(
    subscribeSupabaseSync,
    getSupabaseSyncSnapshot,
    getSupabaseSyncServerSnapshot,
  )
}
