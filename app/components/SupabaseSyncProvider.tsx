'use client'

import { useEffect, type JSX } from 'react'
import { isSupabaseConfigured } from '../lib/isSupabaseConfigured'
import { subscribeLayout } from '../lib/layoutStore'
import { subscribeShortcuts } from '../lib/keyboardShortcuts'
import { subscribeLists } from '../lib/listsStore'
import { subscribeNotes } from '../lib/notesStore'
import { runSupabaseSync } from '../lib/runSupabaseSync'
import { scheduleSupabaseSync } from '../lib/scheduleSupabaseSync'
import { subscribeSort } from '../lib/sortStore'
import { getSupabaseAuthSnapshot, subscribeSupabaseAuth } from '../lib/supabaseAuthStore'
import { subscribeTheme } from '../lib/themeStore'

const PERIODIC_SYNC_MS: number = 60_000

/**
 * Wires Supabase pull/push to local stores after sign-in and on local changes.
 */
export function SupabaseSyncProvider(): JSX.Element | null {
  useEffect((): (() => void) | undefined => {
    if (!isSupabaseConfigured() || typeof window === 'undefined') return undefined

    let signedIn: boolean = false
    let periodicTimer: ReturnType<typeof setInterval> | null = null

    const startPeriodicSync = (): void => {
      if (periodicTimer !== null) return
      periodicTimer = setInterval((): void => {
        void runSupabaseSync()
      }, PERIODIC_SYNC_MS)
    }

    const stopPeriodicSync = (): void => {
      if (periodicTimer === null) return
      clearInterval(periodicTimer)
      periodicTimer = null
    }

    const handleAuthChange = (): void => {
      const { status } = getSupabaseAuthSnapshot()
      if (status === 'signed-in' && !signedIn) {
        signedIn = true
        void runSupabaseSync()
        startPeriodicSync()
      }
      if (status === 'signed-out' && signedIn) {
        signedIn = false
        stopPeriodicSync()
      }
    }

    const unsubAuth = subscribeSupabaseAuth(handleAuthChange)
    handleAuthChange()

    const unsubNotes = subscribeNotes(scheduleSupabaseSync)
    const unsubLists = subscribeLists(scheduleSupabaseSync)
    const unsubTheme = subscribeTheme(scheduleSupabaseSync)
    const unsubLayout = subscribeLayout(scheduleSupabaseSync)
    const unsubSort = subscribeSort(scheduleSupabaseSync)
    const unsubShortcuts = subscribeShortcuts(scheduleSupabaseSync)

    return (): void => {
      unsubAuth()
      unsubNotes()
      unsubLists()
      unsubTheme()
      unsubLayout()
      unsubSort()
      unsubShortcuts()
      stopPeriodicSync()
    }
  }, [])

  return null
}
