import type { NoteList } from './types'

/**
 * Creates a fresh, non-persisted list with the supplied name.
 *
 * @param name Display name for the list.
 */
export function createList(name: string): NoteList {
  const now: number = Date.now()
  const id: string =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${now}-${Math.random().toString(36).slice(2, 10)}`

  return {
    id,
    name,
    createdAt: now,
    updatedAt: now,
  }
}
