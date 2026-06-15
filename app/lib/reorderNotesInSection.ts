import type { Note } from './types'

/**
 * Reorders notes within a visible section while preserving positions of notes
 * outside the section in the global array.
 *
 * @param allNotes Full notes collection in current storage order.
 * @param sectionNotes Notes in the section being reordered (e.g. pinned).
 * @param fromId Id of the dragged note.
 * @param toId Id of the drop target note.
 */
export function reorderNotesInSection(
  allNotes: ReadonlyArray<Note>,
  sectionNotes: ReadonlyArray<Note>,
  fromId: string,
  toId: string,
): ReadonlyArray<string> {
  const allIds: string[] = allNotes.map((note: Note): string => note.id)
  const sectionIds: string[] = sectionNotes.map((note: Note): string => note.id)
  const fromIdx: number = sectionIds.indexOf(fromId)
  const toIdx: number = sectionIds.indexOf(toId)

  if (fromIdx < 0 || toIdx < 0 || fromId === toId) return allIds

  const newSectionIds: string[] = [...sectionIds]
  newSectionIds.splice(fromIdx, 1)
  newSectionIds.splice(toIdx, 0, fromId)

  const sectionSet: Set<string> = new Set(sectionIds)
  const result: string[] = []
  let sectionPtr: number = 0

  for (const id of allIds) {
    if (sectionSet.has(id)) {
      if (sectionPtr < newSectionIds.length) {
        result.push(newSectionIds[sectionPtr])
        sectionPtr += 1
      }
    } else {
      result.push(id)
    }
  }

  return result
}
