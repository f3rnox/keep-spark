'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { EditorPane, NoteLayout } from './types'
import {
  getEditorPaneServerSnapshot,
  getEditorPaneSnapshot,
  getNoteLayoutServerSnapshot,
  getNoteLayoutSnapshot,
  setEditorPane,
  setNoteLayout,
  subscribeLayout,
} from './layoutStore'

/**
 * Public API returned by the `useNoteLayout` hook.
 */
export interface NoteLayoutApi {
  layout: NoteLayout
  setLayout: (next: NoteLayout) => void
  editorPane: EditorPane
  setEditorPane: (next: EditorPane) => void
}

/**
 * Subscribes to the shared layout store and exposes note layout together with
 * editor pane preferences and referentially stable setters.
 */
export function useNoteLayout(): NoteLayoutApi {
  const layout: NoteLayout = useSyncExternalStore(
    subscribeLayout,
    getNoteLayoutSnapshot,
    getNoteLayoutServerSnapshot,
  )
  const editorPane: EditorPane = useSyncExternalStore(
    subscribeLayout,
    getEditorPaneSnapshot,
    getEditorPaneServerSnapshot,
  )

  const setLayout = useCallback((next: NoteLayout): void => {
    setNoteLayout(next)
  }, [])

  const setEditorPanePreference = useCallback((next: EditorPane): void => {
    setEditorPane(next)
  }, [])

  return {
    layout,
    setLayout,
    editorPane,
    setEditorPane: setEditorPanePreference,
  }
}
