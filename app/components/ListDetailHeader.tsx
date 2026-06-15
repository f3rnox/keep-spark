'use client'

import type { JSX } from 'react'
import type { NoteList } from '../lib/types'
import { Icon } from './Icon'

/**
 * Props for the list detail breadcrumb header.
 */
export interface ListDetailHeaderProps {
  list: NoteList
  onBack: () => void
}

/**
 * Header shown when viewing notes inside a single list, with a back control.
 *
 * @param props.list The list currently being viewed.
 * @param props.onBack Returns to the lists overview.
 */
export function ListDetailHeader({ list, onBack }: ListDetailHeaderProps): JSX.Element {
  return (
    <div className='mb-8 flex items-center gap-3'>
      <button
        type='button'
        onClick={onBack}
        className='inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        <Icon name='chevronLeft' size={18} />
        <span>Lists</span>
      </button>
      <h2 className='text-lg font-semibold tracking-tight text-foreground'>{list.name}</h2>
    </div>
  )
}
