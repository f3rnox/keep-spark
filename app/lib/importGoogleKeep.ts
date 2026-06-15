import type { Note, NoteList } from './types'
import { createList } from './createList'
import { createNote } from './createNote'
import { mapKeepColorToNoteColor } from './mapKeepColorToNoteColor'
import { normalizeLabel } from './normalizeLabel'
import {
  GOOGLE_KEEP_IMPORT_LABEL,
  parseGoogleKeepJson,
  type ParsedGoogleKeepNote,
} from './parseGoogleKeepJson'
import { parseGoogleKeepHtml } from './parseGoogleKeepHtml'
import { getListsSnapshot, setLists } from './listsStore'
import { getNotesSnapshot, setNotes } from './notesStore'
import { saveListsToIdb } from './saveListsToIdb'
import { saveNotesToIdb } from './saveNotesToIdb'

/**
 * Result of importing notes from Google Keep exports.
 */
export interface ImportGoogleKeepResult {
  noteCount: number
  listCount: number
  skippedCount: number
}

/**
 * Parses one Google Keep export file into a normalized note, if possible.
 *
 * @param raw File contents.
 * @param fileName Original file name used to detect format.
 */
function parseGoogleKeepFile(raw: string, fileName: string): ParsedGoogleKeepNote | null {
  const trimmed: string = raw.trim()
  if (trimmed.length === 0) return null

  if (trimmed.startsWith('{')) {
    try {
      return parseGoogleKeepJson(JSON.parse(trimmed) as unknown)
    } catch {
      return null
    }
  }

  if (fileName.toLowerCase().endsWith('.html') || trimmed.startsWith('<')) {
    return parseGoogleKeepHtml(raw)
  }

  return null
}

/**
 * Imports Google Keep JSON or HTML exports, merging them into existing local data.
 *
 * @param files Keep export files from Google Takeout.
 */
export async function importGoogleKeep(files: ReadonlyArray<File>): Promise<ImportGoogleKeepResult> {
  const parsedNotes: ParsedGoogleKeepNote[] = []
  let skippedCount: number = 0

  for (const file of files) {
    const raw: string = await file.text()
    const parsed: ParsedGoogleKeepNote | null = parseGoogleKeepFile(raw, file.name)
    if (parsed === null) {
      skippedCount += 1
      continue
    }
    if (parsed.trashed) {
      skippedCount += 1
      continue
    }
    parsedNotes.push(parsed)
  }

  if (parsedNotes.length === 0) {
    throw new Error('No valid Google Keep notes were found in the selected files.')
  }

  const existingLists: ReadonlyArray<NoteList> = getListsSnapshot()
  const listByName: Map<string, NoteList> = new Map(
    existingLists.map((list: NoteList): [string, NoteList] => [list.name.toLowerCase(), list]),
  )
  const newLists: NoteList[] = []

  for (const parsed of parsedNotes) {
    if (parsed.listName === null) continue
    const key: string = parsed.listName.toLowerCase()
    if (!listByName.has(key)) {
      const list: NoteList = createList(parsed.listName)
      listByName.set(key, list)
      newLists.push(list)
    }
  }

  const importLabel: string = normalizeLabel(GOOGLE_KEEP_IMPORT_LABEL)
  const importedNotes: Note[] = parsedNotes.map((parsed: ParsedGoogleKeepNote): Note => {
    const note: Note = createNote(parsed.title, parsed.content)
    const labelSet: Set<string> = new Set(
      parsed.labels.map((label: string): string => normalizeLabel(label)).filter((label: string): boolean => label.length > 0),
    )
    labelSet.add(importLabel)

    let listId: string | null = null
    if (parsed.listName !== null) {
      listId = listByName.get(parsed.listName.toLowerCase())?.id ?? null
    }

    return {
      ...note,
      labels: [...labelSet],
      color: mapKeepColorToNoteColor(parsed.color),
      listId,
      pinned: parsed.pinned,
      archived: parsed.archived,
      trashed: false,
      trashedAt: null,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
    }
  })

  const mergedLists: NoteList[] = [...existingLists, ...newLists]
  const mergedNotes: Note[] = [...getNotesSnapshot(), ...importedNotes]

  await Promise.all([saveNotesToIdb(mergedNotes), saveListsToIdb(mergedLists)])
  setNotes((): ReadonlyArray<Note> => mergedNotes, { recordHistory: false })
  setLists((): ReadonlyArray<NoteList> => mergedLists)

  return {
    noteCount: importedNotes.length,
    listCount: newLists.length,
    skippedCount,
  }
}
