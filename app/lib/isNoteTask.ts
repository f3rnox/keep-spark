import type { Note } from './types'

/**
 * Returns whether a note is a checkbox task.
 *
 * @param note Note to inspect.
 */
export function isNoteTask(note: Note): boolean {
  return note.isTask === true
}
