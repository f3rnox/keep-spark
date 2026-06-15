/**
 * In-memory session keys and decrypted previews for unlocked encrypted notes.
 * Cleared on page reload.
 */
const sessionKeys: Map<string, CryptoKey> = new Map()
const sessionContent: Map<string, string> = new Map()
const listeners: Set<() => void> = new Set()
let sessionVersion: number = 0

/**
 * Notifies subscribers that session state changed.
 */
function notifySessionChange(): void {
  sessionVersion += 1
  for (const listener of listeners) {
    listener()
  }
}

/**
 * Subscribes to encryption session changes.
 *
 * @param listener Callback invoked when session state changes.
 */
export function subscribeEncryptionSession(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Returns a version token that changes when session state changes.
 */
export function getEncryptionSessionVersion(): number {
  return sessionVersion
}

/**
 * Returns whether a note has an active unlock session.
 *
 * @param noteId Note identifier.
 */
export function isNoteUnlockedInSession(noteId: string): boolean {
  return sessionKeys.has(noteId)
}

/**
 * Returns the cached session key for a note, if any.
 *
 * @param noteId Note identifier.
 */
export function getSessionKey(noteId: string): CryptoKey | undefined {
  return sessionKeys.get(noteId)
}

/**
 * Returns cached plaintext content for a note preview, if any.
 *
 * @param noteId Note identifier.
 */
export function getSessionContent(noteId: string): string | undefined {
  return sessionContent.get(noteId)
}

/**
 * Stores a derived session key and optional decrypted content for a note.
 *
 * @param noteId Note identifier.
 * @param key Derived AES-GCM key.
 * @param content Optional plaintext content for list previews.
 */
export function setSessionKey(
  noteId: string,
  key: CryptoKey,
  content?: string,
): void {
  sessionKeys.set(noteId, key)
  if (content !== undefined) {
    sessionContent.set(noteId, content)
  }
  notifySessionChange()
}

/**
 * Updates cached plaintext content for an unlocked note.
 *
 * @param noteId Note identifier.
 * @param content Plaintext note body.
 */
export function setSessionContent(noteId: string, content: string): void {
  sessionContent.set(noteId, content)
  notifySessionChange()
}

/**
 * Removes the cached session key and preview content for a note.
 *
 * @param noteId Note identifier.
 */
export function clearSessionKey(noteId: string): void {
  sessionKeys.delete(noteId)
  sessionContent.delete(noteId)
  notifySessionChange()
}

/**
 * Returns whether any per-note unlock session is active.
 */
export function hasAnySessionKeys(): boolean {
  return sessionKeys.size > 0
}

/**
 * Clears every per-note unlock session.
 */
export function clearAllSessionKeys(): void {
  sessionKeys.clear()
  sessionContent.clear()
  notifySessionChange()
}
