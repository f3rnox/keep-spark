/**
 * Available color themes for the application UI.
 */
export type Theme =
  | 'light'
  | 'dark'
  | 'ocean'
  | 'forest'
  | 'rose'
  | 'lavender'
  | 'sepia'
  | 'slate'
  | 'ember'

/**
 * Metadata for one selectable color palette.
 */
export interface ThemeDefinition {
  label: string
  description: string
  isDark: boolean
  swatch: ReadonlyArray<string>
}

/**
 * `localStorage` key under which the user's explicit theme choice is persisted.
 */
export const THEME_STORAGE_KEY: string = 'keepspark:theme'

/**
 * Default theme when no preference has been saved.
 */
export const DEFAULT_THEME: Theme = 'light'

/**
 * Ordered list of themes used for cycling and settings display.
 */
export const THEME_ORDER: ReadonlyArray<Theme> = [
  'light',
  'dark',
  'ocean',
  'forest',
  'rose',
  'lavender',
  'sepia',
  'slate',
  'ember',
]

/**
 * Display metadata and preview swatches for every theme.
 */
export const THEME_DEFINITIONS: Record<Theme, ThemeDefinition> = {
  light: {
    label: 'Stone',
    description: 'Warm neutrals with a paper-bright canvas.',
    isDark: false,
    swatch: ['#fafaf9', '#e7e5e4', '#1c1917'],
  },
  dark: {
    label: 'Midnight',
    description: 'Near-black canvas with soft stone text.',
    isDark: true,
    swatch: ['#0b0b0c', '#2a2a2e', '#f4f4f3'],
  },
  ocean: {
    label: 'Ocean',
    description: 'Cool sky blues with deep teal accents.',
    isDark: false,
    swatch: ['#f0f9ff', '#bae6fd', '#0369a1'],
  },
  forest: {
    label: 'Forest',
    description: 'Fresh greens on a dewy light canvas.',
    isDark: false,
    swatch: ['#f0fdf4', '#bbf7d0', '#15803d'],
  },
  rose: {
    label: 'Rose',
    description: 'Blush pinks with rich crimson accents.',
    isDark: false,
    swatch: ['#fff1f2', '#fecdd3', '#be123c'],
  },
  lavender: {
    label: 'Lavender',
    description: 'Soft violets with bold purple highlights.',
    isDark: false,
    swatch: ['#faf5ff', '#e9d5ff', '#7c3aed'],
  },
  sepia: {
    label: 'Sepia',
    description: 'Aged paper tones with amber ink.',
    isDark: false,
    swatch: ['#fefce8', '#fde68a', '#a16207'],
  },
  slate: {
    label: 'Slate',
    description: 'Cool blue-gray night with icy accents.',
    isDark: true,
    swatch: ['#0f172a', '#334155', '#38bdf8'],
  },
  ember: {
    label: 'Ember',
    description: 'Warm charcoal with glowing orange accents.',
    isDark: true,
    swatch: ['#1c1412', '#44403c', '#fb923c'],
  },
}

/**
 * Returns whether a string is a supported theme id.
 *
 * @param value Candidate theme id.
 */
export function isTheme(value: string): value is Theme {
  return Object.hasOwn(THEME_DEFINITIONS, value)
}

/**
 * Resolves a persisted or system theme id, falling back to the default.
 *
 * @param stored Value read from storage, if any.
 * @param prefersDark Whether the OS prefers a dark color scheme.
 */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored !== null && isTheme(stored)) return stored
  return prefersDark ? 'dark' : DEFAULT_THEME
}

/**
 * Returns the next theme when cycling through the palette list.
 *
 * @param current Active theme id.
 */
export function nextTheme(current: Theme): Theme {
  const index: number = THEME_ORDER.indexOf(current)
  const nextIndex: number = index < 0 ? 0 : (index + 1) % THEME_ORDER.length
  return THEME_ORDER[nextIndex]
}
