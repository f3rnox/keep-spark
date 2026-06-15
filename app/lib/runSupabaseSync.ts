import { applySyncSettings } from './applySyncSettings'
import { collectSyncSettings } from './collectSyncSettings'
import { getListsSnapshot, setLists } from './listsStore'
import { mergeByUpdatedAt } from './mergeByUpdatedAt'
import { getNotesSnapshot, setNotes } from './notesStore'
import { pullFromSupabase } from './pullFromSupabase'
import { pushToSupabase } from './pushToSupabase'
import { getSupabaseAuthSnapshot } from './supabaseAuthStore'
import {
  setSupabaseSyncError,
  setSupabaseSyncSuccess,
  setSupabaseSyncing,
} from './supabaseSyncStore'
import { saveListsToIdb } from './saveListsToIdb'
import { saveNotesToIdb } from './saveNotesToIdb'
import type { SyncSettingsPayload } from './syncSettingsTypes'
import { runWithoutSupabaseSync } from './scheduleSupabaseSync'

let syncInFlight: Promise<void> | null = null

/**
 * Pulls remote data, merges with local state, then pushes the merged snapshot.
 */
export async function runSupabaseSync(): Promise<void> {
  const { status, user } = getSupabaseAuthSnapshot()
  if (status !== 'signed-in' || user === null) return

  if (syncInFlight !== null) {
    await syncInFlight
    return
  }

  setSupabaseSyncing()

  syncInFlight = (async (): Promise<void> => {
    try {
      const remote = await pullFromSupabase()
      const localNotes = getNotesSnapshot()
      const localLists = getListsSnapshot()
      const localSettings = collectSyncSettings()

      const mergedNotes = mergeByUpdatedAt(localNotes, remote.notes)
      const mergedLists = mergeByUpdatedAt(localLists, remote.lists)

      let mergedSettings: SyncSettingsPayload = localSettings
      if (remote.settings !== null && remote.settings.updatedAt >= localSettings.updatedAt) {
        mergedSettings = remote.settings
      }

      await Promise.all([
        saveNotesToIdb(mergedNotes),
        saveListsToIdb(mergedLists),
      ])

      runWithoutSupabaseSync((): void => {
        setNotes((): typeof mergedNotes => mergedNotes, { recordHistory: false })
        setLists((): typeof mergedLists => mergedLists)
        applySyncSettings(mergedSettings)
      })

      await pushToSupabase(mergedNotes, mergedLists)
      setSupabaseSyncSuccess()
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : 'Sync failed.'
      setSupabaseSyncError(message)
      throw error
    } finally {
      syncInFlight = null
    }
  })()

  await syncInFlight
}
