import { THEME_DEFINITIONS } from './theme'
import { getThemeSnapshot, migrateThemePreferences } from './themeStore'

/**
 * Applies the persisted or system-preferred theme before React paints.
 */
export function bootstrapTheme(): void {
  if (globalThis.window === undefined) return

  try {
    migrateThemePreferences()
    const theme = getThemeSnapshot()
    const root: HTMLElement = document.documentElement
    const definition = THEME_DEFINITIONS[theme]

    root.dataset.theme = theme
    if (definition.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    root.style.colorScheme = definition.isDark ? 'dark' : 'light'
  } catch {
    /* ignore storage or media-query failures */
  }
}
