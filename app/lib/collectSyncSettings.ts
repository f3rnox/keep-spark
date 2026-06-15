import { getEditorPaneSnapshot, getNoteLayoutSnapshot } from './layoutStore'
import { getShortcutsSnapshot } from './keyboardShortcuts'
import { getSortSnapshot } from './sortStore'
import { getThemeSnapshot } from './themeStore'
import type { SyncSettingsPayload } from './syncSettingsTypes'

/**
 * Reads current UI preferences into a sync payload.
 */
export function collectSyncSettings(): SyncSettingsPayload {
  const shortcuts: Record<string, ReadonlyArray<string>> = {}
  for (const shortcut of getShortcutsSnapshot()) {
    if (shortcut.customizable !== false) {
      shortcuts[shortcut.id] = shortcut.keys
    }
  }

  return {
    theme: getThemeSnapshot(),
    layout: getNoteLayoutSnapshot(),
    editorPane: getEditorPaneSnapshot(),
    sort: getSortSnapshot(),
    shortcuts,
    updatedAt: Date.now(),
  }
}
