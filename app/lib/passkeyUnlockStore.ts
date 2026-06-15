/**
 * Stored passkey metadata used to unlock the master encryption password.
 */
export interface PasskeyUnlockRecord {
  credentialId: string
  prfSalt: string
  iv: string
  ciphertext: string
}

const STORAGE_KEY: string = 'keepspark:passkey-unlock'

let snapshot: PasskeyUnlockRecord | null = null
let hydrated: boolean = false
const listeners: Set<() => void> = new Set()

/**
 * Ensures the passkey unlock record has been loaded from storage.
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
        typeof (parsed as PasskeyUnlockRecord).credentialId === 'string' &&
        typeof (parsed as PasskeyUnlockRecord).prfSalt === 'string' &&
        typeof (parsed as PasskeyUnlockRecord).iv === 'string' &&
        typeof (parsed as PasskeyUnlockRecord).ciphertext === 'string'
      ) {
        snapshot = parsed as PasskeyUnlockRecord
      }
    } catch {
      snapshot = null
    }
  }

  hydrated = true
}

/**
 * Returns whether a passkey unlock credential is configured.
 */
export function hasPasskeyUnlockSnapshot(): boolean {
  ensureHydrated()
  return snapshot !== null
}

/**
 * Returns the stored passkey unlock record, if any.
 */
export function getPasskeyUnlockSnapshot(): PasskeyUnlockRecord | null {
  ensureHydrated()
  return snapshot
}

/**
 * Returns the server-side passkey snapshot used during SSR.
 */
export function getPasskeyUnlockServerSnapshot(): PasskeyUnlockRecord | null {
  return null
}

/**
 * Registers a subscriber invoked when passkey unlock state changes.
 *
 * @param listener Callback invoked on every snapshot update.
 */
export function subscribePasskeyUnlock(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Persists a passkey unlock record.
 *
 * @param record Credential metadata and encrypted master password.
 */
export function setPasskeyUnlockRecord(record: PasskeyUnlockRecord): void {
  if (typeof window === 'undefined') return
  ensureHydrated()
  snapshot = record
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  for (const listener of listeners) listener()
}

/**
 * Clears the configured passkey unlock record.
 */
export function clearPasskeyUnlockRecord(): void {
  if (typeof window === 'undefined') return
  ensureHydrated()
  snapshot = null
  window.localStorage.removeItem(STORAGE_KEY)
  for (const listener of listeners) listener()
}
