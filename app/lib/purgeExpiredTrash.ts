import type { Note } from './types'

/** Number of days before trashed notes are permanently deleted. */
export const TRASH_RETENTION_DAYS: number = 7

const MS_PER_DAY: number = 86_400_000

/**
 * Removes notes that have been in trash longer than the retention period.
 *
 * @param notes Full notes collection loaded from storage.
 */
export function purgeExpiredTrash(notes: ReadonlyArray<Note>): ReadonlyArray<Note> {
  const cutoff: number = Date.now() - TRASH_RETENTION_DAYS * MS_PER_DAY

  return notes.filter((note: Note): boolean => {
    if (!note.trashed) return true
    if (note.trashedAt === null) return true
    return note.trashedAt > cutoff
  })
}
