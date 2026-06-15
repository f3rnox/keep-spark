import { LISTS_STORAGE_KEY } from './listsStorage'
import { DEFAULT_NOTE_LAYOUT } from './noteLayout'
import { clearRecentSearches } from './recentSearchesStore'
import { setLists } from './listsStore'
import { clearNotesHistory, setNotes } from './notesStore'
import { setNoteLayout } from './layoutStore'
import { setSort } from './sortStore'
import { STORAGE_KEY } from './storage'
import { saveListsToIdb } from './saveListsToIdb'
import { saveNotesToIdb } from './saveNotesToIdb'
import { setTheme } from './themeStore'

/**
 * Removes all locally stored notes, lists, and preferences.
 */
export async function clearAppData(): Promise<void> {
  await Promise.all([saveNotesToIdb([]), saveListsToIdb([])])

  setNotes((): ReadonlyArray<never> => [], { recordHistory: false })
  setLists((): ReadonlyArray<never> => [])
  clearNotesHistory()
  clearRecentSearches()
  setSort('updated')
  setNoteLayout(DEFAULT_NOTE_LAYOUT)
  setTheme('light')

  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(LISTS_STORAGE_KEY)
  } catch {
    /* ignore storage failures */
  }
}
