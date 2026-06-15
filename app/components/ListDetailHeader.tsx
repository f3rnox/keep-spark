'use client'

import type { JSX } from 'react'
import type { NoteList } from '../lib/types'
import { Icon } from './Icon'
import { InlineRename } from './InlineRename'

/**
 * Props for the list detail breadcrumb header.
 */
export interface ListDetailHeaderProps {
  list: NoteList
  onBack: () => void
  onRename: (id: string, name: string) => void
}

/**
 * Header shown when viewing notes inside a single list, with a back control.
 */
export function ListDetailHeader({
  list,
  onBack,
  onRename,
}: ListDetailHeaderProps): JSX.Element {
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
      <InlineRename
        value={list.name}
        onSave={(name: string): void => onRename(list.id, name)}
        className='text-lg font-semibold tracking-tight text-foreground'
        inputClassName='rounded bg-surface-hover px-2 py-1 text-lg font-semibold outline-none'
      />
    </div>
  )
}
