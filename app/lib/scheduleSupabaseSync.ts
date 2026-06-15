import { getListsSnapshot } from './listsStore'
import { getNotesSnapshot } from './notesStore'
import { pushToSupabase } from './pushToSupabase'
import { getSupabaseAuthSnapshot } from './supabaseAuthStore'
import { setSupabaseSyncError } from './supabaseSyncStore'

let suppressSync: boolean = false
let pushTimer: ReturnType<typeof setTimeout> | null = null
let pushInFlight: Promise<void> | null = null

const PUSH_DEBOUNCE_MS: number = 2000

/**
 * Runs a callback without scheduling Supabase pushes (used when applying remote data).
 *
 * @param callback Side effect to run while sync push is suppressed.
 */
export function runWithoutSupabaseSync(callback: () => void): void {
  suppressSync = true
  try {
    callback()
  } finally {
    suppressSync = false
  }
}

/**
 * Debounces a push of the current local snapshot to Supabase.
 */
export function scheduleSupabaseSync(): void {
  if (suppressSync || typeof window === 'undefined') return

  const { status } = getSupabaseAuthSnapshot()
  if (status !== 'signed-in') return

  if (pushTimer !== null) {
    clearTimeout(pushTimer)
  }

  pushTimer = setTimeout((): void => {
    pushTimer = null
    void flushSupabasePush()
  }, PUSH_DEBOUNCE_MS)
}

/**
 * Immediately pushes local notes and lists to Supabase.
 */
export async function flushSupabasePush(): Promise<void> {
  const { status } = getSupabaseAuthSnapshot()
  if (status !== 'signed-in') return

  if (pushInFlight !== null) {
    await pushInFlight
    return
  }

  pushInFlight = (async (): Promise<void> => {
    try {
      await pushToSupabase(getNotesSnapshot(), getListsSnapshot())
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : 'Sync push failed.'
      setSupabaseSyncError(message)
    } finally {
      pushInFlight = null
    }
  })()

  await pushInFlight
}
