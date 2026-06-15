import type { NoteLayout } from './types'

/**
 * `localStorage` key for the persisted note layout preference.
 */
export const LAYOUT_STORAGE_KEY: string = 'keepspark:layout'

/**
 * Default layout when no preference has been saved.
 */
export const DEFAULT_NOTE_LAYOUT: NoteLayout = 'grid'
