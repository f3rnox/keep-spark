import type { Note } from './types'
import { noteLinkPattern } from './noteLinkPattern'
import { isNoteEncrypted } from './isNoteEncrypted'

/**
 * Finds notes whose content references the target note via `[[title]]` links.
 *
 * @param notes Full notes collection.
 * @param target Note to find backlinks for.
 */
export function findBacklinks(
  notes: ReadonlyArray<Note>,
  target: Note,
): ReadonlyArray<Note> {
  const title: string = target.title.trim()
  if (title.length === 0) return []

  const pattern: RegExp = noteLinkPattern(title)

  return notes.filter((note: Note): boolean => {
    if (note.id === target.id) return false
    if (isNoteEncrypted(note)) return false
    return pattern.test(note.content)
  })
}
