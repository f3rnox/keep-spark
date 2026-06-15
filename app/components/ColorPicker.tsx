'use client'

import type { JSX } from 'react'
import type { NoteColor } from '../lib/types'
import { NOTE_COLOR_LABELS, NOTE_COLOR_ORDER, getNoteColorClasses } from '../lib/colors'
import { Icon } from './Icon'

/**
 * Props for the `ColorPicker` swatch row.
 */
export interface ColorPickerProps {
  value: NoteColor
  onChange: (next: NoteColor) => void
  className?: string
}

/**
 * Inline row of circular color swatches. Renders the entire `NoteColor`
 * palette and surfaces the active selection with a check mark overlay.
 *
 * @param props.value The currently selected color token.
 * @param props.onChange Invoked when a swatch is clicked.
 * @param props.className Optional extra classes applied to the wrapper.
 */
export function ColorPicker({ value, onChange, className = '' }: ColorPickerProps): JSX.Element {
  return (
    <div
      role='radiogroup'
      aria-label='Note color'
      className={`grid grid-cols-6 gap-1.5 ${className}`.trim()}
    >
      {NOTE_COLOR_ORDER.map((color: NoteColor): JSX.Element => {
        const classes = getNoteColorClasses(color)
        const selected: boolean = color === value
        const isDefault: boolean = color === 'default'
        return (
          <button
            key={color}
            type='button'
            role='radio'
            aria-checked={selected}
            aria-label={NOTE_COLOR_LABELS[color]}
            title={NOTE_COLOR_LABELS[color]}
            onClick={(): void => onChange(color)}
            className={`relative flex h-6 w-6 items-center justify-center rounded-full transition hover:scale-110 ${classes.dot} ${
              selected
                ? 'ring-2 ring-foreground ring-offset-2 ring-offset-surface'
                : ''
            }`}
          >
            {selected && isDefault ? (
              <span className='pointer-events-none text-foreground'>
                <Icon name='check' size={13} />
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
