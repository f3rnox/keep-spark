import type { Note } from './types'

/**
 * Collects every unique label from the supplied notes, sorted alphabetically.
 *
 * @param notes Notes to scan for labels.
 */
export function collectLabels(notes: ReadonlyArray<Note>): ReadonlyArray<string> {
  const seen: Set<string> = new Set<string>()

  for (const note of notes) {
    for (const label of note.labels) {
      seen.add(label)
    }
  }

  return [...seen].sort((a: string, b: string): number => a.localeCompare(b))
}
