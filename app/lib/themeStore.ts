'use client'

import { applyTheme } from './applyTheme'
import type { Theme } from './theme'

type ThemeListener = () => void

const listeners: Set<ThemeListener> = new Set<ThemeListener>()

/**
 * Subscribes to theme changes. Intended for use with `useSyncExternalStore`.
 *
 * @param listener Invoked whenever the active theme changes.
 */
export function subscribeTheme(listener: ThemeListener): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Client snapshot: the theme currently applied to the document element by the
 * bootstrap script or a previous toggle.
 */
export function getThemeSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Server snapshot used during SSR and the initial hydration render.
 */
export function getThemeServerSnapshot(): Theme {
  return 'light'
}

/**
 * Activates a theme, persists the choice, and notifies all subscribers.
 *
 * @param theme The theme to apply.
 */
export function setTheme(theme: Theme): void {
  applyTheme(theme)
  for (const listener of listeners) {
    listener()
  }
}

/**
 * Flips between the light and dark themes based on the current document state.
 */
export function toggleTheme(): void {
  const current: Theme = getThemeSnapshot()
  setTheme(current === 'dark' ? 'light' : 'dark')
}
