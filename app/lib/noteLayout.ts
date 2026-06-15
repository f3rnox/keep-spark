import type { EditorPane, NoteLayout } from './types'

/**
 * `localStorage` key for the persisted note layout preference.
 */
export const LAYOUT_STORAGE_KEY: string = 'keepspark:layout'

/**
 * `localStorage` key for the persisted editor pane preference.
 */
export const EDITOR_PANE_STORAGE_KEY: string = 'keepspark:editor-pane'

/**
 * Default layout when no preference has been saved.
 */
export const DEFAULT_NOTE_LAYOUT: NoteLayout = 'grid'

/**
 * Default editor presentation when no preference has been saved.
 */
export const DEFAULT_EDITOR_PANE: EditorPane = 'overlay'
