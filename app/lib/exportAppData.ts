import type { Note, NoteList } from './types'
import { loadListsAsync } from './listsStorage'
import { loadNotesAsync } from './storage'

/**
 * Serialized backup payload written to export files.
 */
export interface AppExportPayload {
  version: 1
  exportedAt: number
  notes: ReadonlyArray<Note>
  lists: ReadonlyArray<NoteList>
}

/**
 * Builds a JSON backup of all notes and lists stored locally.
 */
export async function exportAppData(): Promise<string> {
  const [notes, lists]: [ReadonlyArray<Note>, ReadonlyArray<NoteList>] = await Promise.all([
    loadNotesAsync(),
    loadListsAsync(),
  ])

  const payload: AppExportPayload = {
    version: 1,
    exportedAt: Date.now(),
    notes,
    lists,
  }

  return JSON.stringify(payload, null, 2)
}
