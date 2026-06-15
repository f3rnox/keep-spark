import type { Note } from './types'

/**
 * Returns whether a note is stored in encrypted form.
 *
 * @param note Note to inspect.
 */
export function isNoteEncrypted(note: Note): boolean {
  return note.encrypted === true && note.cipher !== null
}
