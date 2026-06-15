import type { Note } from './types'

/**
 * Resolves a note by title for wiki-link navigation.
 *
 * @param notes Full notes collection.
 * @param title Linked note title.
 */
export function findNoteByTitle(
  notes: ReadonlyArray<Note>,
  title: string,
): Note | null {
  const normalized: string = title.trim().toLowerCase()
  if (normalized.length === 0) return null

  return (
    notes.find(
      (note: Note): boolean =>
        !note.trashed && note.title.trim().toLowerCase() === normalized,
    ) ?? null
  )
}
