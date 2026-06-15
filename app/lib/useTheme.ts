'use client'

import { useSyncExternalStore } from 'react'
import type { Theme } from './theme'
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
  toggleTheme,
} from './themeStore'

/**
 * Public API returned by the `useTheme` hook.
 */
export interface ThemeApi {
  theme: Theme
  setTheme: (next: Theme) => void
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

  return { theme, setTheme, toggleTheme }
}
