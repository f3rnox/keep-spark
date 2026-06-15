'use client'

import { applyTheme } from './applyTheme'
import { DEFAULT_THEME, isTheme, nextTheme, type Theme } from './theme'

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
  const datasetTheme: string | undefined = document.documentElement.dataset.theme
  if (datasetTheme !== undefined && isTheme(datasetTheme)) return datasetTheme
  return document.documentElement.classList.contains('dark') ? 'dark' : DEFAULT_THEME
}

/**
 * Server snapshot used during SSR and the initial hydration render.
 */
export function getThemeServerSnapshot(): Theme {
  return DEFAULT_THEME
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
 * Advances to the next theme in the palette list.
 */
export function toggleTheme(): void {
  setTheme(nextTheme(getThemeSnapshot()))
}
