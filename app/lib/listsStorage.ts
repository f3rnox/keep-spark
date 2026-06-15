import type { NoteList } from './types'

/**
 * `localStorage` key under which named lists are serialized as JSON.
 */
export const LISTS_STORAGE_KEY: string = 'keepspark:lists:v1'

/**
 * Ensures a parsed list entry has the expected shape.
 *
 * @param entry Raw parsed object from storage.
 */
function coerceList(entry: unknown): NoteList | null {
  if (typeof entry !== 'object' || entry === null) return null

  const candidate = entry as Partial<NoteList>
  if (typeof candidate.id !== 'string' || typeof candidate.name !== 'string') {
    return null
  }

  return {
    id: candidate.id,
    name: candidate.name,
    createdAt: candidate.createdAt ?? Date.now(),
    updatedAt: candidate.updatedAt ?? Date.now(),
  }
}

/**
 * Loads the persisted lists collection from `localStorage`.
 */
export function loadLists(): ReadonlyArray<NoteList> {
  if (typeof window === 'undefined') return []

  try {
    const raw: string | null = window.localStorage.getItem(LISTS_STORAGE_KEY)
    if (raw === null) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((entry: unknown): NoteList | null => coerceList(entry))
      .filter((list: NoteList | null): list is NoteList => list !== null)
  } catch {
    return []
  }
}
