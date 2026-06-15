import type { Note, NoteList } from './types'
import { collectSyncSettings } from './collectSyncSettings'
import { getSupabaseClient } from './supabaseClient'
import { getSupabaseAuthSnapshot } from './supabaseAuthStore'
import type { SyncSettingsPayload } from './syncSettingsTypes'

/**
 * Pushes local notes, lists, and settings to Supabase for the signed-in user.
 *
 * @param notes Local notes snapshot.
 * @param lists Local lists snapshot.
 */
export async function pushToSupabase(
  notes: ReadonlyArray<Note>,
  lists: ReadonlyArray<NoteList>,
): Promise<void> {
  const supabase = getSupabaseClient()
  const { user } = getSupabaseAuthSnapshot()
  if (supabase === null || user === null) return

  const settings: SyncSettingsPayload = collectSyncSettings()
  const now: string = new Date().toISOString()

  const noteRows = notes.map((note: Note) => ({
    user_id: user.id,
    id: note.id,
    data: note,
    updated_at: new Date(note.updatedAt).toISOString(),
  }))

  const listRows = lists.map((list: NoteList) => ({
    user_id: user.id,
    id: list.id,
    data: list,
    updated_at: new Date(list.updatedAt).toISOString(),
  }))

  const { data: remoteNotes } = await supabase
    .from('sync_notes')
    .select('id')
    .eq('user_id', user.id)

  const { data: remoteLists } = await supabase
    .from('sync_lists')
    .select('id')
    .eq('user_id', user.id)

  const localNoteIds: Set<string> = new Set<string>(notes.map((note: Note): string => note.id))
  const localListIds: Set<string> = new Set<string>(lists.map((list: NoteList): string => list.id))

  const noteIdsToDelete: string[] = (remoteNotes ?? [])
    .map((row: { id: string }): string => row.id)
    .filter((id: string): boolean => !localNoteIds.has(id))

  const listIdsToDelete: string[] = (remoteLists ?? [])
    .map((row: { id: string }): string => row.id)
    .filter((id: string): boolean => !localListIds.has(id))

  if (noteRows.length > 0) {
    const { error } = await supabase.from('sync_notes').upsert(noteRows, {
      onConflict: 'user_id,id',
    })
    if (error !== null) throw error
  }

  if (listRows.length > 0) {
    const { error } = await supabase.from('sync_lists').upsert(listRows, {
      onConflict: 'user_id,id',
    })
    if (error !== null) throw error
  }

  const { error: settingsError } = await supabase.from('sync_settings').upsert({
    user_id: user.id,
    data: settings,
    updated_at: now,
  })
  if (settingsError !== null) throw settingsError

  if (noteIdsToDelete.length > 0) {
    const { error } = await supabase
      .from('sync_notes')
      .delete()
      .eq('user_id', user.id)
      .in('id', noteIdsToDelete)
    if (error !== null) throw error
  }

  if (listIdsToDelete.length > 0) {
    const { error } = await supabase
      .from('sync_lists')
      .delete()
      .eq('user_id', user.id)
      .in('id', listIdsToDelete)
    if (error !== null) throw error
  }

  if (notes.length === 0) {
    const { error } = await supabase.from('sync_notes').delete().eq('user_id', user.id)
    if (error !== null) throw error
  }

  if (lists.length === 0) {
    const { error } = await supabase.from('sync_lists').delete().eq('user_id', user.id)
    if (error !== null) throw error
  }
}
