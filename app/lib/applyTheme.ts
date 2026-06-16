import { THEME_DEFINITIONS, THEME_STORAGE_KEY, type Theme } from './theme'
import { showSettingSaved } from './settingToastStore'

/**
 * Applies a theme to the document element and persists the choice so it
 * survives reloads. Storage failures (private mode, quota) are ignored.
 *
 * @param theme The theme to activate.
 * @param options Optional configuration.
 * @param options.silent If true, suppresses the settings-saved toast.
 */
export function applyTheme(theme: Theme, options?: { silent?: boolean }): void {
  const root: HTMLElement = document.documentElement
  const definition = THEME_DEFINITIONS[theme]
  const changed: boolean = root.dataset.theme !== theme

  root.dataset.theme = theme
  if (definition.isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = definition.isDark ? 'dark' : 'light'

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage failures.
  }

  if (changed && options?.silent !== true) {
    showSettingSaved(`${THEME_DEFINITIONS[theme].label} theme saved`)
  }
}
