import { THEME_STORAGE_KEY, type Theme } from './theme'

/**
 * Applies a theme to the document element and persists the choice so it
 * survives reloads. Storage failures (private mode, quota) are ignored.
 *
 * @param theme The theme to activate.
 */
export function applyTheme(theme: Theme): void {
  const root: HTMLElement = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage failures.
  }
}
