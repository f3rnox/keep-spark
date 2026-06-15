import type { Note, NoteList } from './types'
import { coerceList } from './coerceList'
import { coerceNote } from './coerceNote'
import type { AppExportPayload } from './exportAppData'
import { setLists } from './listsStore'
import { setNotes } from './notesStore'
import { saveListsToIdb } from './saveListsToIdb'
import { saveNotesToIdb } from './saveNotesToIdb'

/**
 * Result of attempting to import a backup file.
 */
export interface ImportAppDataResult {
  noteCount: number
  listCount: number
}

function parsePayload(raw: string): AppExportPayload {
  const parsed: unknown = JSON.parse(raw)

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Backup file is not a valid JSON object.')
  }

  const record: Record<string, unknown> = parsed as Record<string, unknown>

  if (record.version !== 1) {
    throw new Error('Unsupported backup version.')
  }

  if (!Array.isArray(record.notes) || !Array.isArray(record.lists)) {
    throw new Error('Backup file is missing notes or lists.')
  }

  const notes: Note[] = record.notes
    .map((entry: unknown): Note | null => coerceNote(entry))
    .filter((note: Note | null): note is Note => note !== null)

  const lists: NoteList[] = record.lists
    .map((entry: unknown): NoteList | null => coerceList(entry))
    .filter((list: NoteList | null): list is NoteList => list !== null)

  if (notes.length === 0 && lists.length === 0) {
    throw new Error('Backup file contains no valid notes or lists.')
  }

  return {
    version: 1,
    exportedAt: typeof record.exportedAt === 'number' ? record.exportedAt : Date.now(),
    notes,
    lists,
  }
}

/**
 * Imports notes and lists from a JSON backup, replacing current local data.
 *
 * @param raw JSON string from an export file.
 */
export async function importAppData(raw: string): Promise<ImportAppDataResult> {
  const payload: AppExportPayload = parsePayload(raw)

  await Promise.all([
    saveNotesToIdb(payload.notes),
    saveListsToIdb(payload.lists),
  ])

  setNotes((): ReadonlyArray<Note> => payload.notes, { recordHistory: false })
  setLists((): ReadonlyArray<NoteList> => payload.lists)

  return {
    noteCount: payload.notes.length,
    listCount: payload.lists.length,
  }
}
