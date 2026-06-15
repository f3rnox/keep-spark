'use client'

import type { JSX } from 'react'
import type { NoteList } from '../lib/types'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/**
 * Props for a single list tile in the browser grid.
 */
export interface ListCardProps {
  list: NoteList
  noteCount: number
  onOpen: (list: NoteList) => void
  onDelete: (id: string) => void
}

/**
 * Clickable card representing one named list, showing its title, active note
 * count, and a delete control revealed on hover.
 *
 * @param props.list The list to render.
 * @param props.noteCount Number of active notes in the list.
 * @param props.onOpen Invoked when the user opens the list.
 * @param props.onDelete Invoked when the user deletes the list.
 */
export function ListCard({
  list,
  noteCount,
  onOpen,
  onDelete,
}: ListCardProps): JSX.Element {
  return (
    <article className='group relative rounded-xl border border-border bg-surface text-foreground transition-colors hover:border-foreground/25'>
      <button
        type='button'
        onClick={(): void => onOpen(list)}
        className='flex w-full flex-col items-start gap-3 px-4 py-4 text-left'
      >
        <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-surface-hover text-muted'>
          <Icon name='list' size={20} />
        </span>
        <div>
          <h3 className='text-[15px] font-semibold tracking-tight'>{list.name}</h3>
          <p className='mt-1 text-xs text-muted'>
            {noteCount === 1 ? '1 note' : `${noteCount} notes`}
          </p>
        </div>
      </button>
      <div className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100'>
        <IconButton
          label={`Delete ${list.name}`}
          onClick={(event): void => {
            event.stopPropagation()
            onDelete(list.id)
          }}
        >
          <Icon name='trash' size={18} />
        </IconButton>
      </div>
    </article>
  )
}
