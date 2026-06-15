import type { Note } from './types'

/**
 * Returns the title to display for a note.
 *
 * @param note Note whose title should be resolved.
 */
export function getNoteDisplayTitle(note: Note): string {
  return note.title
}
