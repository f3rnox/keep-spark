import { showSettingSaved } from './settingToastStore'

const STORAGE_KEY: string = 'keepspark:auto-lock-minutes'

/** Minutes of inactivity before locking encryption sessions. `0` disables auto-lock. */
export type AutoLockMinutes = 0 | 5 | 15 | 30 | 60

const VALID_MINUTES: ReadonlyArray<AutoLockMinutes> = [0, 5, 15, 30, 60]

let snapshot: AutoLockMinutes = 0
let hydrated: boolean = false
const listeners: Set<() => void> = new Set()

/**
 * Ensures the auto-lock preference has been loaded from storage.
 */
function ensureHydrated(): void {
  if (hydrated) return
  if (typeof window === 'undefined') return

  const raw: string | null = window.localStorage.getItem(STORAGE_KEY)
  if (raw !== null) {
    const parsed: number = Number.parseInt(raw, 10)
    if ((VALID_MINUTES as ReadonlyArray<number>).includes(parsed)) {
      snapshot = parsed as AutoLockMinutes
    }
  }

  hydrated = true
}

/**
 * Returns the configured auto-lock timeout in minutes.
 */
export function getAutoLockMinutesSnapshot(): AutoLockMinutes {
  ensureHydrated()
  return snapshot
}

/**
 * Returns the server-side auto-lock snapshot used during SSR.
 */
export function getAutoLockMinutesServerSnapshot(): AutoLockMinutes {
  return 0
}

/**
 * Registers a subscriber invoked when the auto-lock preference changes.
 *
 * @param listener Callback invoked on every snapshot update.
 */
export function subscribeAutoLock(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Persists the auto-lock timeout preference.
 *
 * @param minutes Idle minutes before locking, or `0` to disable.
 */
export function setAutoLockMinutes(minutes: AutoLockMinutes): void {
  if (typeof window === 'undefined') return
  ensureHydrated()
  if (snapshot === minutes) return
  snapshot = minutes
  window.localStorage.setItem(STORAGE_KEY, String(minutes))
  for (const listener of listeners) listener()
  showSettingSaved('Auto-lock saved')
}

/**
 * Clears the auto-lock preference.
 */
export function clearAutoLockMinutes(): void {
  if (typeof window === 'undefined') return
  ensureHydrated()
  snapshot = 0
  window.localStorage.removeItem(STORAGE_KEY)
  for (const listener of listeners) listener()
}
