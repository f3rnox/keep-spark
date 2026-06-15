import type { Note, NoteList } from './types'
import { coerceList } from './coerceList'
import { coerceNote } from './coerceNote'
import { coerceAppExportPayload, detectBackupFormatFromRaw } from './detectBackupFormat'
import { decryptEncryptedExportPayload } from './decryptEncryptedExportPayload'
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
  const format = detectBackupFormatFromRaw(raw)
  if (format !== 'keepspark-v1') {
    throw new Error('Use password-protected import for encrypted backups.')
  }

  const parsed: unknown = JSON.parse(raw)
  const coerced: AppExportPayload = coerceAppExportPayload(parsed)

  const notes: Note[] = coerced.notes
    .map((entry: unknown): Note | null => coerceNote(entry))
    .filter((note: Note | null): note is Note => note !== null)

  const lists: NoteList[] = coerced.lists
    .map((entry: unknown): NoteList | null => coerceList(entry))
    .filter((list: NoteList | null): list is NoteList => list !== null)

  if (notes.length === 0 && lists.length === 0) {
    throw new Error('Backup file contains no valid notes or lists.')
  }

  return {
    version: 1,
    exportedAt: coerced.exportedAt,
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
  return applyImportPayload(payload)
}

/**
 * Imports notes and lists from a password-protected encrypted backup.
 *
 * @param raw JSON string from an encrypted export file.
 * @param password Export password used when creating the backup.
 */
export async function importEncryptedAppData(
  raw: string,
  password: string,
): Promise<ImportAppDataResult> {
  const payload: AppExportPayload = await decryptEncryptedExportPayload(raw, password)

  const notes: Note[] = payload.notes
    .map((entry: unknown): Note | null => coerceNote(entry))
    .filter((note: Note | null): note is Note => note !== null)

  const lists: NoteList[] = payload.lists
    .map((entry: unknown): NoteList | null => coerceList(entry))
    .filter((list: NoteList | null): list is NoteList => list !== null)

  if (notes.length === 0 && lists.length === 0) {
    throw new Error('Backup file contains no valid notes or lists.')
  }

  return applyImportPayload({
    version: 1,
    exportedAt: payload.exportedAt,
    notes,
    lists,
  })
}

/**
 * Persists a validated export payload, replacing current local data.
 *
 * @param payload Parsed backup payload.
 */
async function applyImportPayload(payload: AppExportPayload): Promise<ImportAppDataResult> {
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
