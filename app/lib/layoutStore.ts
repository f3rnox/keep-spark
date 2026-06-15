'use client'

import type { NoteLayout } from './types'
import { DEFAULT_NOTE_LAYOUT, LAYOUT_STORAGE_KEY } from './noteLayout'

type LayoutListener = () => void

const listeners: Set<LayoutListener> = new Set<LayoutListener>()
let snapshot: NoteLayout = DEFAULT_NOTE_LAYOUT
let hydrated: boolean = false

/**
 * Reads the saved layout from `localStorage` on first client access.
 */
function ensureHydrated(): void {
  if (hydrated || typeof window === 'undefined') return

  try {
    const raw: string | null = window.localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (raw === 'grid' || raw === 'stacked') {
      snapshot = raw
    }
  } catch {
    snapshot = DEFAULT_NOTE_LAYOUT
  }

  hydrated = true
}

/**
 * Subscribes to layout changes. Intended for use with `useSyncExternalStore`.
 *
 * @param listener Invoked whenever the active layout changes.
 */
export function subscribeLayout(listener: LayoutListener): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Client snapshot of the active note layout.
 */
export function getLayoutSnapshot(): NoteLayout {
  ensureHydrated()
  return snapshot
}

/**
 * Server snapshot used during SSR and the initial hydration render.
 */
export function getLayoutServerSnapshot(): NoteLayout {
  return DEFAULT_NOTE_LAYOUT
}

/**
 * Persists and activates a note layout, notifying all subscribers.
 *
 * @param layout Layout to apply.
 */
export function setNoteLayout(layout: NoteLayout): void {
  snapshot = layout
  hydrated = true

  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, layout)
  } catch {
    /* ignore quota / privacy errors */
  }

  for (const listener of listeners) {
    listener()
  }
}
