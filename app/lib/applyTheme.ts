import { THEME_DEFINITIONS, THEME_STORAGE_KEY, type Theme } from './theme'
import { showSettingSaved } from './settingToastStore'

/**
 * Applies a theme to the document element and persists the choice so it
 * survives reloads. Storage failures (private mode, quota) are ignored.
 *
 * @param theme The theme to activate.
 */
export function applyTheme(theme: Theme): void {
  const root: HTMLElement = document.documentElement
  const definition = THEME_DEFINITIONS[theme]
  const changed: boolean = root.dataset.theme !== theme

  root.dataset.theme = theme
  root.classList.toggle('dark', definition.isDark)
  root.style.colorScheme = definition.isDark ? 'dark' : 'light'

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage failures.
  }

  if (changed) {
    showSettingSaved(`${THEME_DEFINITIONS[theme].label} theme saved`)
  }
}
