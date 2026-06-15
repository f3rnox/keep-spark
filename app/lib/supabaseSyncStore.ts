export type SupabaseSyncStatus = 'idle' | 'syncing' | 'error'

export interface SupabaseSyncSnapshot {
  status: SupabaseSyncStatus
  lastSyncedAt: number | null
  error: string | null
}

const SERVER_SNAPSHOT: SupabaseSyncSnapshot = {
  status: 'idle',
  lastSyncedAt: null,
  error: null,
}

let snapshot: SupabaseSyncSnapshot = SERVER_SNAPSHOT
const listeners: Set<() => void> = new Set()

function notifyListeners(): void {
  for (const listener of listeners) listener()
}

/**
 * Returns the current sync status snapshot.
 */
export function getSupabaseSyncSnapshot(): SupabaseSyncSnapshot {
  return snapshot
}

/**
 * Returns the SSR sync status snapshot.
 */
export function getSupabaseSyncServerSnapshot(): SupabaseSyncSnapshot {
  return SERVER_SNAPSHOT
}

/**
 * Subscribes to sync status changes.
 *
 * @param listener Callback invoked on every status update.
 */
export function subscribeSupabaseSync(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Marks sync as in progress.
 */
export function setSupabaseSyncing(): void {
  snapshot = { ...snapshot, status: 'syncing', error: null }
  notifyListeners()
}

/**
 * Marks sync as successfully completed.
 */
export function setSupabaseSyncSuccess(): void {
  snapshot = {
    status: 'idle',
    lastSyncedAt: Date.now(),
    error: null,
  }
  notifyListeners()
}

/**
 * Records a sync failure message.
 *
 * @param message Human-readable error text.
 */
export function setSupabaseSyncError(message: string): void {
  snapshot = { ...snapshot, status: 'error', error: message }
  notifyListeners()
}

/**
 * Clears sync error state.
 */
export function clearSupabaseSyncError(): void {
  if (snapshot.error === null && snapshot.status !== 'error') return
  snapshot = { ...snapshot, status: 'idle', error: null }
  notifyListeners()
}
