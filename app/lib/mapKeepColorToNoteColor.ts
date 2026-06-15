import type { NoteColor } from './types'

const KEEP_COLOR_MAP: Readonly<Record<string, NoteColor>> = {
  DEFAULT: 'default',
  RED: 'red',
  CORAL: 'red',
  ORANGE: 'orange',
  PEACH: 'orange',
  YELLOW: 'yellow',
  SAND: 'yellow',
  GREEN: 'green',
  MINT: 'green',
  TEAL: 'teal',
  SAGE: 'teal',
  BLUE: 'blue',
  FOAM: 'blue',
  DARKBLUE: 'darkblue',
  CERULEAN: 'darkblue',
  PURPLE: 'purple',
  LAVENDER: 'purple',
  PINK: 'pink',
  FLAMINGO: 'pink',
  BROWN: 'brown',
  CHOCOLATE: 'brown',
  GRAY: 'gray',
  GREY: 'gray',
}

/**
 * Maps a Google Keep color string to a KeepSpark note color.
 *
 * @param keepColor Color value from a Google Keep export.
 */
export function mapKeepColorToNoteColor(keepColor: string | undefined): NoteColor {
  if (keepColor === undefined || keepColor.length === 0) return 'default'
  const mapped: NoteColor | undefined = KEEP_COLOR_MAP[keepColor.toUpperCase()]
  return mapped ?? 'default'
}
