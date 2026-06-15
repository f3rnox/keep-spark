import type { EditorPane, NoteLayout, NoteSort } from './types'
import type { Theme } from './theme'

/**
 * UI preferences synced to Supabase (excludes device-local security data).
 */
export interface SyncSettingsPayload {
  theme: Theme
  layout: NoteLayout
  editorPane: EditorPane
  sort: NoteSort
  shortcuts: Record<string, ReadonlyArray<string>>
  updatedAt: number
}
