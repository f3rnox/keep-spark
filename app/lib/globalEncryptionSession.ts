import { clearAllSessionKeys } from './encryptionSessionStore'

let masterPassword: string | null = null
let globallyUnlocked: boolean = false
let sessionVersion: number = 0
const listeners: Set<() => void> = new Set()

/**
 * Notifies subscribers that global encryption session state changed.
 */
function notifyGlobalChange(): void {
  sessionVersion += 1
  for (const listener of listeners) {
    listener()
  }
}

/**
 * Subscribes to global encryption session changes.
 *
 * @param listener Callback invoked when session state changes.
 */
export function subscribeGlobalEncryption(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Returns a version token that changes when global encryption state changes.
 */
export function getGlobalEncryptionVersion(): number {
  return sessionVersion
}

/**
 * Returns whether the global encryption session is unlocked.
 */
export function isGlobalEncryptionUnlocked(): boolean {
  return globallyUnlocked && masterPassword !== null
}

/**
 * Returns the in-memory master password when globally unlocked.
 */
export function getGlobalEncryptionPassword(): string | null {
  if (!isGlobalEncryptionUnlocked()) return null
  return masterPassword
}

/**
 * Stores the master password in memory for the current session.
 *
 * @param password Verified master encryption password.
 */
export function unlockGlobalEncryptionSession(password: string): void {
  masterPassword = password
  globallyUnlocked = true
  notifyGlobalChange()
}

/**
 * Clears the global encryption session and all per-note unlock sessions.
 */
export function lockGlobalEncryptionSession(): void {
  masterPassword = null
  globallyUnlocked = false
  clearAllSessionKeys()
  notifyGlobalChange()
}
