import type { MasterPasswordVerifier } from './masterPasswordVerifier'
import { showSettingSaved } from './settingToastStore'

const STORAGE_KEY: string = 'keepspark:master-password-verifier'

let snapshot: MasterPasswordVerifier | null = null
let hydrated: boolean = false
const listeners: Set<() => void> = new Set()

/**
 * Ensures the master password verifier has been loaded from storage.
 */
function ensureHydrated(): void {
  if (hydrated) return
  if (typeof window === 'undefined') return

  const raw: string | null = window.localStorage.getItem(STORAGE_KEY)
  if (raw !== null) {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof (parsed as MasterPasswordVerifier).salt === 'string' &&
        typeof (parsed as MasterPasswordVerifier).hash === 'string' &&
        typeof (parsed as MasterPasswordVerifier).iterations === 'number'
      ) {
        snapshot = parsed as MasterPasswordVerifier
      }
    } catch {
      snapshot = null
    }
  }

  hydrated = true
}

/**
 * Returns whether a master encryption password has been configured.
 */
export function hasMasterPasswordSnapshot(): boolean {
  ensureHydrated()
  return snapshot !== null
}

/**
 * Returns the stored master password verifier, if any.
 */
export function getMasterPasswordVerifierSnapshot(): MasterPasswordVerifier | null {
  ensureHydrated()
  return snapshot
}

/**
 * Returns the server-side master password snapshot used during SSR.
 */
export function getMasterPasswordServerSnapshot(): MasterPasswordVerifier | null {
  return null
}

/**
 * Registers a subscriber invoked when the master password preference changes.
 *
 * @param listener Callback invoked on every snapshot update.
 */
export function subscribeMasterPassword(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Persists a new master password verifier.
 *
 * @param verifier Verifier metadata to store.
 */
export function setMasterPasswordVerifier(verifier: MasterPasswordVerifier): void {
  if (typeof window === 'undefined') return
  ensureHydrated()
  snapshot = verifier
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(verifier))
  for (const listener of listeners) listener()
  showSettingSaved('Encryption password saved')
}

/**
 * Clears the configured master password verifier.
 */
export function clearMasterPasswordVerifier(): void {
  if (typeof window === 'undefined') return
  ensureHydrated()
  snapshot = null
  window.localStorage.removeItem(STORAGE_KEY)
  for (const listener of listeners) listener()
  showSettingSaved('Encryption password removed')
}
