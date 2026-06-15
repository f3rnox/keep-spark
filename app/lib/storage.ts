import type { Note } from './types'

/**
 * `localStorage` key under which the entire notes collection is serialized as
 * JSON. Bumped if the stored shape ever changes.
 */
export const STORAGE_KEY: string = 'keepspark:notes:v1'

/**
 * Ensures a parsed note entry has the expected shape, migrating older records
 * that predate the `labels` field.
 *
 * @param entry Raw parsed object from storage.
 */
function coerceNote(entry: unknown): Note | null {
  if (typeof entry !== 'object' || entry === null) return null

  const candidate = entry as Partial<Note>
  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.content !== 'string'
  ) {
    return null
  }

  const labels: ReadonlyArray<string> = Array.isArray(candidate.labels)
    ? candidate.labels.filter((label: unknown): label is string => typeof label === 'string')
    : []

  return {
    id: candidate.id,
    title: candidate.title,
    content: candidate.content,
    labels,
    color: candidate.color ?? 'default',
    listId: typeof candidate.listId === 'string' ? candidate.listId : null,
    pinned: candidate.pinned ?? false,
    archived: candidate.archived ?? false,
    trashed: candidate.trashed ?? false,
    createdAt: candidate.createdAt ?? Date.now(),
    updatedAt: candidate.updatedAt ?? Date.now(),
  }
}

/**
 * Loads the persisted notes collection from `localStorage`. Always returns an
 * array, even when storage is empty, missing, or contains malformed JSON.
 */
export function loadNotes(): ReadonlyArray<Note> {
  if (typeof window === 'undefined') return []

  try {
    const raw: string | null = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((entry: unknown): Note | null => coerceNote(entry))
      .filter((note: Note | null): note is Note => note !== null)
  } catch {
    return []
  }
}
