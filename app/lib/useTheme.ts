'use client'

import { useSyncExternalStore } from 'react'
import type { Theme } from './theme'
import {
  getDarkThemeServerSnapshot,
  getDarkThemeSnapshot,
  getLightThemeServerSnapshot,
  getLightThemeSnapshot,
  getThemeServerSnapshot,
  getThemeSnapshot,
  setDarkTheme,
  setLightTheme,
  setTheme,
  subscribeTheme,
  toggleTheme,
} from './themeStore'

/**
 * Public API returned by the `useTheme` hook.
 */
export interface ThemeApi {
  theme: Theme
  lightTheme: Theme
  darkTheme: Theme
  setTheme: (next: Theme) => void
  setLightTheme: (next: Theme) => void
  setDarkTheme: (next: Theme) => void
  toggleTheme: () => void
}

/**
 * Subscribes to the shared theme store and exposes the active theme together
 * with referentially stable mutators. Hydration-safe via `useSyncExternalStore`
 * (the server snapshot is `light`, reconciled with the DOM after hydration).
 */
export function useTheme(): ThemeApi {
  const theme: Theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  )
  const lightTheme: Theme = useSyncExternalStore(
    subscribeTheme,
    getLightThemeSnapshot,
    getLightThemeServerSnapshot,
  )
  const darkTheme: Theme = useSyncExternalStore(
    subscribeTheme,
    getDarkThemeSnapshot,
    getDarkThemeServerSnapshot,
  )

  return {
    theme,
    lightTheme,
    darkTheme,
    setTheme,
    setLightTheme,
    setDarkTheme,
    toggleTheme,
  }
}
