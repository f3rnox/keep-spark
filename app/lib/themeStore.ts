'use client'

import { applyTheme } from './applyTheme'
import {
  DARK_THEME_STORAGE_KEY,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  DEFAULT_THEME,
  LIGHT_THEME_STORAGE_KEY,
  THEME_DEFINITIONS,
  THEME_STORAGE_KEY,
  isTheme,
  pairedTheme,
  resolveDarkTheme,
  resolveLightTheme,
  resolveTheme,
  type Theme,
} from './theme'

type ThemeListener = () => void

const listeners: Set<ThemeListener> = new Set<ThemeListener>()

let preferencesMigrated: boolean = false

/**
 * Seeds light/dark palette preferences from the active theme when unset.
 */
export function migrateThemePreferences(): void {
  if (preferencesMigrated || typeof window === 'undefined') return
  preferencesMigrated = true

  try {
    const hasLight: boolean = window.localStorage.getItem(LIGHT_THEME_STORAGE_KEY) !== null
    const hasDark: boolean = window.localStorage.getItem(DARK_THEME_STORAGE_KEY) !== null
    if (hasLight && hasDark) return

    const stored: string | null = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === null || !isTheme(stored)) return

    if (!hasLight && !THEME_DEFINITIONS[stored].isDark) {
      window.localStorage.setItem(LIGHT_THEME_STORAGE_KEY, stored)
    }

    if (!hasDark && THEME_DEFINITIONS[stored].isDark) {
      window.localStorage.setItem(DARK_THEME_STORAGE_KEY, stored)
    }
  } catch {
    // Ignore storage failures.
  }
}

/**
 * Subscribes to theme changes. Intended for use with `useSyncExternalStore`.
 *
 * @param listener Invoked whenever the active theme changes.
 */
export function subscribeTheme(listener: ThemeListener): () => void {
  migrateThemePreferences()
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Notifies all theme subscribers after a store mutation.
 */
function notifyThemeListeners(): void {
  for (const listener of listeners) {
    listener()
  }
}

/**
 * Client snapshot: the theme currently applied to the document element.
 */
export function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const datasetTheme: string | undefined = document.documentElement.dataset.theme
  if (datasetTheme !== undefined && isTheme(datasetTheme)) return datasetTheme

  // Fallback to localStorage if datasetTheme is not set yet (e.g. during hydration render)
  try {
    const stored: string | null = window.localStorage.getItem(THEME_STORAGE_KEY)
    const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches
    return resolveTheme(stored, prefersDark)
  } catch {
    return document.documentElement.classList.contains('dark') ? DEFAULT_DARK_THEME : DEFAULT_THEME
  }
}

/**
 * Client snapshot for the preferred light palette used by the header toggle.
 */
export function getLightThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return DEFAULT_LIGHT_THEME
  try {
    const stored = window.localStorage.getItem(LIGHT_THEME_STORAGE_KEY)
    return resolveLightTheme(stored)
  } catch {
    return DEFAULT_LIGHT_THEME
  }
}

/**
 * Client snapshot for the preferred dark palette used by the header toggle.
 */
export function getDarkThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return DEFAULT_DARK_THEME
  try {
    const stored = window.localStorage.getItem(DARK_THEME_STORAGE_KEY)
    return resolveDarkTheme(stored)
  } catch {
    return DEFAULT_DARK_THEME
  }
}

/**
 * Server snapshot used during SSR and the initial hydration render.
 */
export function getThemeServerSnapshot(): Theme {
  return DEFAULT_THEME
}

/**
 * Server snapshot for the preferred light palette.
 */
export function getLightThemeServerSnapshot(): Theme {
  return DEFAULT_LIGHT_THEME
}

/**
 * Server snapshot for the preferred dark palette.
 */
export function getDarkThemeServerSnapshot(): Theme {
  return DEFAULT_DARK_THEME
}

/**
 * Persists a light or dark palette preference without applying it.
 *
 * @param key Storage key for the preference.
 * @param theme Palette id to save.
 */
function persistThemePreference(key: string, theme: Theme): void {
  try {
    window.localStorage.setItem(key, theme)
  } catch {
    // Ignore storage failures.
  }
}

/**
 * Saves the preferred light palette without changing the active theme.
 *
 * @param theme Light palette id.
 */
export function setLightThemePreference(theme: Theme): void {
  if (THEME_DEFINITIONS[theme].isDark) return
  persistThemePreference(LIGHT_THEME_STORAGE_KEY, theme)
  notifyThemeListeners()
}

/**
 * Saves the preferred dark palette without changing the active theme.
 *
 * @param theme Dark palette id.
 */
export function setDarkThemePreference(theme: Theme): void {
  if (!THEME_DEFINITIONS[theme].isDark) return
  persistThemePreference(DARK_THEME_STORAGE_KEY, theme)
  notifyThemeListeners()
}

/**
 * Activates a theme, persists the choice, and notifies all subscribers.
 *
 * @param theme The theme to apply.
 */
export function setTheme(theme: Theme): void {
  applyTheme(theme)
  notifyThemeListeners()
}

/**
 * Saves the preferred light palette and applies it immediately.
 *
 * @param theme Light palette id.
 */
export function setLightTheme(theme: Theme): void {
  setLightThemePreference(theme)
  setTheme(theme)
}

/**
 * Saves the preferred dark palette and applies it immediately.
 *
 * @param theme Dark palette id.
 */
export function setDarkTheme(theme: Theme): void {
  setDarkThemePreference(theme)
  setTheme(theme)
}

/**
 * Switches between the configured light and dark palettes.
 */
export function toggleTheme(): void {
  migrateThemePreferences()
  const current: Theme = getThemeSnapshot()
  const lightPreferred: Theme = getLightThemeSnapshot()
  const darkPreferred: Theme = getDarkThemeSnapshot()
  const next: Theme = pairedTheme(current, lightPreferred, darkPreferred)
  if (next !== current) setTheme(next)
}
