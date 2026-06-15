'use client'

import type { JSX } from 'react'
import type { NoteLayout } from '../lib/types'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/**
 * Props for the note layout toggle control.
 */
export interface LayoutSelectorProps {
  layout: NoteLayout
  onChange: (next: NoteLayout) => void
}

/**
 * Single-button toggle that flips between grid and stacked layouts. The icon
 * reflects the currently active mode.
 *
 * @param props.layout Currently active layout.
 * @param props.onChange Invoked with the next layout when toggled.
 */
export function LayoutSelector({ layout, onChange }: LayoutSelectorProps): JSX.Element {
  const isGrid: boolean = layout === 'grid'

  return (
    <IconButton
      label={isGrid ? 'Switch to stacked layout' : 'Switch to grid layout'}
      onClick={(): void => onChange(isGrid ? 'stacked' : 'grid')}
    >
      <Icon name={isGrid ? 'grid' : 'stacked'} size={18} />
    </IconButton>
  )
}
