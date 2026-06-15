'use client'

import type { EditorPane, NoteLayout } from './types'
import {
  DEFAULT_EDITOR_PANE,
  DEFAULT_NOTE_LAYOUT,
  EDITOR_PANE_STORAGE_KEY,
  LAYOUT_STORAGE_KEY,
} from './noteLayout'
import { showSettingSaved } from './settingToastStore'

type LayoutListener = () => void

const listeners: Set<LayoutListener> = new Set<LayoutListener>()

const LAYOUT_SERVER_SNAPSHOT: NoteLayout = DEFAULT_NOTE_LAYOUT
const EDITOR_PANE_SERVER_SNAPSHOT: EditorPane = DEFAULT_EDITOR_PANE

let layoutSnapshot: NoteLayout = LAYOUT_SERVER_SNAPSHOT
let editorPaneSnapshot: EditorPane = EDITOR_PANE_SERVER_SNAPSHOT
let hydrated: boolean = false

/**
 * Reads saved layout preferences from `localStorage` on first client access.
 */
function ensureHydrated(): void {
  if (hydrated || typeof window === 'undefined') return

  let layout: NoteLayout = DEFAULT_NOTE_LAYOUT
  let editorPane: EditorPane = DEFAULT_EDITOR_PANE

  try {
    const rawLayout: string | null = window.localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (rawLayout === 'grid' || rawLayout === 'stacked') {
      layout = rawLayout
    }

    const rawEditorPane: string | null = window.localStorage.getItem(EDITOR_PANE_STORAGE_KEY)
    if (rawEditorPane === 'overlay' || rawEditorPane === 'split') {
      editorPane = rawEditorPane
    }
  } catch {
    layout = DEFAULT_NOTE_LAYOUT
    editorPane = DEFAULT_EDITOR_PANE
  }

  layoutSnapshot = layout
  editorPaneSnapshot = editorPane
  hydrated = true
}

/**
 * Subscribes to layout changes. Intended for use with `useSyncExternalStore`.
 *
 * @param listener Invoked whenever layout preferences change.
 */
export function subscribeLayout(listener: LayoutListener): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Client snapshot of the active note layout preference.
 */
export function getNoteLayoutSnapshot(): NoteLayout {
  ensureHydrated()
  return layoutSnapshot
}

/**
 * Server snapshot of the note layout preference during SSR and hydration.
 */
export function getNoteLayoutServerSnapshot(): NoteLayout {
  return LAYOUT_SERVER_SNAPSHOT
}

/**
 * Client snapshot of the active editor pane preference.
 */
export function getEditorPaneSnapshot(): EditorPane {
  ensureHydrated()
  return editorPaneSnapshot
}

/**
 * Server snapshot of the editor pane preference during SSR and hydration.
 */
export function getEditorPaneServerSnapshot(): EditorPane {
  return EDITOR_PANE_SERVER_SNAPSHOT
}

/**
 * Notifies all layout subscribers after a state change.
 */
function notifyLayoutListeners(): void {
  for (const listener of listeners) {
    listener()
  }
}

/**
 * Persists and activates a note layout, notifying all subscribers.
 *
 * @param layout Layout to apply.
 */
export function setNoteLayout(layout: NoteLayout): void {
  ensureHydrated()
  if (layoutSnapshot === layout) return

  layoutSnapshot = layout
  hydrated = true

  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, layout)
  } catch {
    /* ignore quota / privacy errors */
  }

  notifyLayoutListeners()
  showSettingSaved('Note layout saved')
}

/**
 * Persists and activates an editor pane mode, notifying all subscribers.
 *
 * @param editorPane Editor presentation to apply on wide screens.
 */
export function setEditorPane(editorPane: EditorPane): void {
  ensureHydrated()
  if (editorPaneSnapshot === editorPane) return

  editorPaneSnapshot = editorPane
  hydrated = true

  try {
    window.localStorage.setItem(EDITOR_PANE_STORAGE_KEY, editorPane)
  } catch {
    /* ignore quota / privacy errors */
  }

  notifyLayoutListeners()
  showSettingSaved('Editor layout saved')
}
