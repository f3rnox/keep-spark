import type { Note } from './types'

/**
 * Counts active notes (not archived or trashed) that belong to the given list.
 *
 * @param notes Full notes collection.
 * @param listId Target list id.
 */
export function countListNotes(
  notes: ReadonlyArray<Note>,
  listId: string,
): number {
  return notes.filter(
    (note: Note): boolean =>
      note.listId === listId && !note.archived && !note.trashed,
  ).length
}
