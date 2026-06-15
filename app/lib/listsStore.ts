import type { NoteList } from './types'
import { loadLists } from './listsStorage'
import { saveLists } from './saveLists'

let snapshot: ReadonlyArray<NoteList> = []
let hydrated: boolean = false
const listeners: Set<() => void> = new Set()

/** Stable empty snapshot returned during SSR. */
const SERVER_SNAPSHOT: ReadonlyArray<NoteList> = []

function ensureHydrated(): void {
  if (hydrated) return
  if (typeof window === 'undefined') return
  snapshot = loadLists()
  hydrated = true
}

/**
 * Returns the current lists snapshot, lazily hydrating from `localStorage`.
 */
export function getListsSnapshot(): ReadonlyArray<NoteList> {
  ensureHydrated()
  return snapshot
}

/**
 * Returns the server-side snapshot used by `useSyncExternalStore` during SSR.
 */
export function getListsServerSnapshot(): ReadonlyArray<NoteList> {
  return SERVER_SNAPSHOT
}

/**
 * Registers a subscriber invoked whenever the lists snapshot changes.
 *
 * @param listener Callback invoked on every snapshot update.
 */
export function subscribeLists(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Replaces the current lists snapshot, persists it, and notifies subscribers.
 *
 * @param updater Function receiving the previous snapshot, returning the next one.
 */
export function setLists(
  updater: (prev: ReadonlyArray<NoteList>) => ReadonlyArray<NoteList>,
): void {
  if (typeof window === 'undefined') return
  ensureHydrated()
  const next: ReadonlyArray<NoteList> = updater(snapshot)
  if (next === snapshot) return
  snapshot = next
  saveLists(snapshot)
  for (const listener of listeners) listener()
}
