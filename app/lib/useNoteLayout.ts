'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { NoteLayout } from './types'
import {
  getLayoutServerSnapshot,
  getLayoutSnapshot,
  setNoteLayout,
  subscribeLayout,
} from './layoutStore'

/**
 * Public API returned by the `useNoteLayout` hook.
 */
export interface NoteLayoutApi {
  layout: NoteLayout
  setLayout: (next: NoteLayout) => void
}

/**
 * Subscribes to the shared layout store and exposes the active layout together
 * with a referentially stable setter.
 */
export function useNoteLayout(): NoteLayoutApi {
  const layout: NoteLayout = useSyncExternalStore(
    subscribeLayout,
    getLayoutSnapshot,
    getLayoutServerSnapshot,
  )

  const setLayout = useCallback((next: NoteLayout): void => {
    setNoteLayout(next)
  }, [])

  return { layout, setLayout }
}
