/**
 * Available color themes for the application UI.
 */
export type Theme =
  | 'light'
  | 'dark'
  | 'ocean'
  | 'abyss'
  | 'forest'
  | 'pine'
  | 'rose'
  | 'crimson'
  | 'lavender'
  | 'violet'
  | 'sepia'
  | 'cocoa'
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
 * `localStorage` key for the preferred light palette used by the header toggle.
 */
export const LIGHT_THEME_STORAGE_KEY: string = 'keepspark:light-theme'

/**
 * `localStorage` key for the preferred dark palette used by the header toggle.
 */
export const DARK_THEME_STORAGE_KEY: string = 'keepspark:dark-theme'

/**
 * Default theme when no preference has been saved.
 */
export const DEFAULT_THEME: Theme = 'light'

/**
 * Default light palette for the header toggle.
 */
export const DEFAULT_LIGHT_THEME: Theme = 'light'

/**
 * Default dark palette for the header toggle.
 */
export const DEFAULT_DARK_THEME: Theme = 'dark'

/**
 * Ordered list of themes used for settings display.
 */
export const THEME_ORDER: ReadonlyArray<Theme> = [
  'light',
  'dark',
  'ocean',
  'abyss',
  'forest',
  'pine',
  'rose',
  'crimson',
  'lavender',
  'violet',
  'sepia',
  'cocoa',
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
  abyss: {
    label: 'Abyss',
    description: 'Deep sea blues with luminous cyan highlights.',
    isDark: true,
    swatch: ['#0a1628', '#1e3a5f', '#38bdf8'],
  },
  forest: {
    label: 'Forest',
    description: 'Fresh greens on a dewy light canvas.',
    isDark: false,
    swatch: ['#f0fdf4', '#bbf7d0', '#15803d'],
  },
  pine: {
    label: 'Pine',
    description: 'Shadowy woodland greens with bright leaf accents.',
    isDark: true,
    swatch: ['#0a1f12', '#166534', '#4ade80'],
  },
  rose: {
    label: 'Rose',
    description: 'Blush pinks with rich crimson accents.',
    isDark: false,
    swatch: ['#fff1f2', '#fecdd3', '#be123c'],
  },
  crimson: {
    label: 'Crimson',
    description: 'Velvet reds with soft pink highlights.',
    isDark: true,
    swatch: ['#1a0610', '#881337', '#fb7185'],
  },
  lavender: {
    label: 'Lavender',
    description: 'Soft violets with bold purple highlights.',
    isDark: false,
    swatch: ['#faf5ff', '#e9d5ff', '#7c3aed'],
  },
  violet: {
    label: 'Violet',
    description: 'Deep purple night with soft lilac glow.',
    isDark: true,
    swatch: ['#1a0f2e', '#5b21b6', '#a78bfa'],
  },
  sepia: {
    label: 'Sepia',
    description: 'Aged paper tones with amber ink.',
    isDark: false,
    swatch: ['#fefce8', '#fde68a', '#a16207'],
  },
  cocoa: {
    label: 'Cocoa',
    description: 'Warm espresso browns with golden accents.',
    isDark: true,
    swatch: ['#1a1410', '#713f12', '#f59e0b'],
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
 * Light palettes available for the header toggle and settings.
 */
export const LIGHT_THEME_ORDER: ReadonlyArray<Theme> = THEME_ORDER.filter(
  (theme: Theme): boolean => !THEME_DEFINITIONS[theme].isDark,
)

/**
 * Dark palettes available for the header toggle and settings.
 */
export const DARK_THEME_ORDER: ReadonlyArray<Theme> = THEME_ORDER.filter(
  (theme: Theme): boolean => THEME_DEFINITIONS[theme].isDark,
)

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
  return prefersDark ? DEFAULT_DARK_THEME : DEFAULT_THEME
}

/**
 * Resolves a persisted light palette preference.
 *
 * @param stored Value read from storage, if any.
 */
export function resolveLightTheme(stored: string | null): Theme {
  if (stored !== null && isTheme(stored) && !THEME_DEFINITIONS[stored].isDark) return stored
  return DEFAULT_LIGHT_THEME
}

/**
 * Resolves a persisted dark palette preference.
 *
 * @param stored Value read from storage, if any.
 */
export function resolveDarkTheme(stored: string | null): Theme {
  if (stored !== null && isTheme(stored) && THEME_DEFINITIONS[stored].isDark) return stored
  return DEFAULT_DARK_THEME
}

/**
 * Returns the paired palette for the header light/dark toggle.
 *
 * @param current Active theme id.
 * @param lightPreferred Saved light palette preference.
 * @param darkPreferred Saved dark palette preference.
 */
export function pairedTheme(
  current: Theme,
  lightPreferred: Theme,
  darkPreferred: Theme,
): Theme {
  return current === darkPreferred ? lightPreferred : darkPreferred
}
