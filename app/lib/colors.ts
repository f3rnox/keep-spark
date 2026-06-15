import type { NoteColor } from './types'

/**
 * Minimalist styling tokens for a single `NoteColor`. Colored notes stay on a
 * neutral surface and express their color through a faint background `tint`, a
 * thin left accent `strip`, and a solid swatch `dot` in the picker.
 */
export interface NoteColorClasses {
  tint: string
  strip: string
  dot: string
}

const NOTE_COLOR_CLASSES: Record<NoteColor, NoteColorClasses> = {
  default: {
    tint: '',
    strip: '',
    dot: 'bg-surface border border-border',
  },
  red: {
    tint: 'bg-rose-50 dark:bg-rose-500/10',
    strip: 'border-l-rose-400 dark:border-l-rose-500',
    dot: 'bg-rose-400',
  },
  orange: {
    tint: 'bg-orange-50 dark:bg-orange-500/10',
    strip: 'border-l-orange-400 dark:border-l-orange-500',
    dot: 'bg-orange-400',
  },
  yellow: {
    tint: 'bg-amber-50 dark:bg-amber-500/10',
    strip: 'border-l-amber-400 dark:border-l-amber-500',
    dot: 'bg-amber-400',
  },
  green: {
    tint: 'bg-emerald-50 dark:bg-emerald-500/10',
    strip: 'border-l-emerald-400 dark:border-l-emerald-500',
    dot: 'bg-emerald-400',
  },
  teal: {
    tint: 'bg-teal-50 dark:bg-teal-500/10',
    strip: 'border-l-teal-400 dark:border-l-teal-500',
    dot: 'bg-teal-400',
  },
  blue: {
    tint: 'bg-sky-50 dark:bg-sky-500/10',
    strip: 'border-l-sky-400 dark:border-l-sky-500',
    dot: 'bg-sky-400',
  },
  darkblue: {
    tint: 'bg-blue-50 dark:bg-blue-500/10',
    strip: 'border-l-blue-500 dark:border-l-blue-500',
    dot: 'bg-blue-500',
  },
  purple: {
    tint: 'bg-violet-50 dark:bg-violet-500/10',
    strip: 'border-l-violet-400 dark:border-l-violet-500',
    dot: 'bg-violet-400',
  },
  pink: {
    tint: 'bg-pink-50 dark:bg-pink-500/10',
    strip: 'border-l-pink-400 dark:border-l-pink-500',
    dot: 'bg-pink-400',
  },
  brown: {
    tint: 'bg-amber-50 dark:bg-amber-700/10',
    strip: 'border-l-amber-600 dark:border-l-amber-600',
    dot: 'bg-amber-600',
  },
  gray: {
    tint: 'bg-slate-50 dark:bg-slate-400/10',
    strip: 'border-l-slate-400 dark:border-l-slate-500',
    dot: 'bg-slate-400',
  },
}

/**
 * Ordered list of every supported note color, used to render the color picker.
 */
export const NOTE_COLOR_ORDER: ReadonlyArray<NoteColor> = [
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'darkblue',
  'purple',
  'pink',
  'brown',
  'gray',
]

/**
 * Human-readable labels for each `NoteColor`, used as tooltips/`aria-label`s.
 */
export const NOTE_COLOR_LABELS: Record<NoteColor, string> = {
  default: 'Default',
  red: 'Coral',
  orange: 'Peach',
  yellow: 'Sand',
  green: 'Sage',
  teal: 'Mint',
  blue: 'Fog',
  darkblue: 'Storm',
  purple: 'Dusk',
  pink: 'Blossom',
  brown: 'Clay',
  gray: 'Chalk',
}

/**
 * Returns the styling token bundle for a given note color, falling back to the
 * `default` (neutral) palette when an unknown color is passed.
 *
 * @param color The note color token to look up.
 */
export function getNoteColorClasses(color: NoteColor): NoteColorClasses {
  return NOTE_COLOR_CLASSES[color] ?? NOTE_COLOR_CLASSES.default
}
