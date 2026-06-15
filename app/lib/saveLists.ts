import type { NoteList } from './types'
import { LISTS_STORAGE_KEY } from './listsStorage'

/**
 * Serializes the supplied lists array and writes it to `localStorage`.
 *
 * @param lists The full lists collection to persist.
 */
export function saveLists(lists: ReadonlyArray<NoteList>): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists))
  } catch {
    // Ignored: storage may be unavailable or full.
  }
}
