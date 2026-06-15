import { setEditorPane, setNoteLayout } from './layoutStore'
import { DEFAULT_KEYBOARD_SHORTCUTS, setShortcutKeys, type ShortcutId } from './keyboardShortcuts'
import { setSort } from './sortStore'
import { setTheme } from './themeStore'
import { isTheme } from './theme'
import type { EditorPane, NoteLayout, NoteSort } from './types'
import type { SyncSettingsPayload } from './syncSettingsTypes'
import { runWithoutSettingToast } from './settingToastStore'
import { runWithoutSupabaseSync } from './scheduleSupabaseSync'

const VALID_LAYOUTS: ReadonlyArray<NoteLayout> = ['grid', 'stacked']
const VALID_EDITOR_PANES: ReadonlyArray<EditorPane> = ['overlay', 'split']
const VALID_SORTS: ReadonlyArray<NoteSort> = ['updated', 'created', 'title', 'color', 'due', 'custom']

/**
 * Applies a remote settings payload to local stores without triggering push.
 *
 * @param payload Remote settings to merge locally.
 */
export function applySyncSettings(payload: SyncSettingsPayload): void {
  runWithoutSupabaseSync((): void => {
    runWithoutSettingToast((): void => {
      if (isTheme(payload.theme)) {
        setTheme(payload.theme)
      }

      if (VALID_LAYOUTS.includes(payload.layout)) {
        setNoteLayout(payload.layout)
      }

      if (VALID_EDITOR_PANES.includes(payload.editorPane)) {
        setEditorPane(payload.editorPane)
      }

      if (VALID_SORTS.includes(payload.sort)) {
        setSort(payload.sort)
      }

      for (const shortcut of DEFAULT_KEYBOARD_SHORTCUTS) {
        if (shortcut.customizable === false) continue
        const keys: ReadonlyArray<string> | undefined = payload.shortcuts[shortcut.id]
        if (keys !== undefined && keys.length > 0) {
          setShortcutKeys(shortcut.id as ShortcutId, keys)
        }
      }
    })
  })
}
