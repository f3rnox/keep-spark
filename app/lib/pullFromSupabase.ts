import type { Note, NoteList } from './types'
import { coerceList } from './coerceList'
import { coerceNote } from './coerceNote'
import { getSupabaseClient } from './supabaseClient'
import { getSupabaseAuthSnapshot } from './supabaseAuthStore'
import type { SyncSettingsPayload } from './syncSettingsTypes'

interface SyncNoteRow {
  id: string
  data: unknown
  updated_at: string
}

interface SyncListRow {
  id: string
  data: unknown
  updated_at: string
}

interface SyncSettingsRow {
  data: unknown
  updated_at: string
}

export interface PulledSupabaseData {
  notes: ReadonlyArray<Note>
  lists: ReadonlyArray<NoteList>
  settings: SyncSettingsPayload | null
}

/**
 * Pulls notes, lists, and settings for the signed-in user.
 */
export async function pullFromSupabase(): Promise<PulledSupabaseData> {
  const supabase = getSupabaseClient()
  const { user } = getSupabaseAuthSnapshot()
  if (supabase === null || user === null) {
    throw new Error('Sign in to sync.')
  }

  const [notesResult, listsResult, settingsResult] = await Promise.all([
    supabase.from('sync_notes').select('id, data, updated_at').eq('user_id', user.id),
    supabase.from('sync_lists').select('id, data, updated_at').eq('user_id', user.id),
    supabase.from('sync_settings').select('data, updated_at').eq('user_id', user.id).maybeSingle(),
  ])

  if (notesResult.error !== null) throw notesResult.error
  if (listsResult.error !== null) throw listsResult.error
  if (settingsResult.error !== null) throw settingsResult.error

  const notes: Note[] = (notesResult.data as SyncNoteRow[] | null ?? [])
    .map((row: SyncNoteRow): Note | null => coerceNote(row.data))
    .filter((note: Note | null): note is Note => note !== null)

  const lists: NoteList[] = (listsResult.data as SyncListRow[] | null ?? [])
    .map((row: SyncListRow): NoteList | null => coerceList(row.data))
    .filter((list: NoteList | null): list is NoteList => list !== null)

  let settings: SyncSettingsPayload | null = null
  const settingsRow: SyncSettingsRow | null = settingsResult.data as SyncSettingsRow | null
  if (settingsRow !== null && settingsRow.data !== null && typeof settingsRow.data === 'object') {
    const raw = settingsRow.data as Partial<SyncSettingsPayload>
    if (
      typeof raw.theme === 'string' &&
      typeof raw.layout === 'string' &&
      typeof raw.editorPane === 'string' &&
      typeof raw.sort === 'string' &&
      typeof raw.shortcuts === 'object' &&
      raw.shortcuts !== null
    ) {
      settings = {
        theme: raw.theme as SyncSettingsPayload['theme'],
        lightTheme:
          typeof raw.lightTheme === 'string'
            ? raw.lightTheme as SyncSettingsPayload['lightTheme']
            : 'light',
        darkTheme:
          typeof raw.darkTheme === 'string'
            ? raw.darkTheme as SyncSettingsPayload['darkTheme']
            : 'dark',
        layout: raw.layout as SyncSettingsPayload['layout'],
        editorPane: raw.editorPane as SyncSettingsPayload['editorPane'],
        sort: raw.sort as SyncSettingsPayload['sort'],
        shortcuts: raw.shortcuts as Record<string, ReadonlyArray<string>>,
        updatedAt: typeof raw.updatedAt === 'number'
          ? raw.updatedAt
          : Date.parse(settingsRow.updated_at),
      }
    }
  }

  return { notes, lists, settings }
}
