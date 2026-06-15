'use client'

import { useState, type DragEvent, type JSX } from 'react'
import type { NoteList } from '../lib/types'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { InlineRename } from './InlineRename'

/**
 * Props for a single list tile in the browser grid.
 */
export interface ListCardProps {
  list: NoteList
  noteCount: number
  draggable?: boolean
  onOpen: (list: NoteList) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
  onDropNote?: (listId: string, noteId: string) => void
  onReorder?: (listId: string) => void
  onDragStartList?: (listId: string) => void
}

/**
 * Clickable card representing one named list, showing its title, active note
 * count, and a delete control revealed on hover.
 */
export function ListCard({
  list,
  noteCount,
  draggable = false,
  onOpen,
  onDelete,
  onRename,
  onDropNote,
  onReorder,
  onDragStartList,
}: ListCardProps): JSX.Element {
  const [dragOver, setDragOver] = useState<boolean>(false)

  return (
    <article
      draggable={draggable}
      onDragStart={(event: DragEvent<HTMLElement>): void => {
        if (!draggable) return
        event.dataTransfer.setData('text/list-id', list.id)
        event.dataTransfer.effectAllowed = 'move'
        onDragStartList?.(list.id)
      }}
      onDragOver={(event: DragEvent<HTMLElement>): void => {
        event.preventDefault()
        if (
          event.dataTransfer.types.includes('text/note-id') ||
          event.dataTransfer.types.includes('text/list-id')
        ) {
          event.dataTransfer.dropEffect = 'move'
          setDragOver(true)
        }
      }}
      onDragLeave={(): void => setDragOver(false)}
      onDrop={(event: DragEvent<HTMLElement>): void => {
        event.preventDefault()
        setDragOver(false)
        const noteId: string = event.dataTransfer.getData('text/note-id')
        const listId: string = event.dataTransfer.getData('text/list-id')
        if (noteId.length > 0) {
          onDropNote?.(list.id, noteId)
        } else if (listId.length > 0 && listId !== list.id) {
          onReorder?.(list.id)
        }
      }}
      className={`group relative rounded-xl border border-border bg-surface text-foreground transition-colors hover:border-foreground/25 ${
        dragOver ? 'ring-2 ring-accent' : ''
      }`}
    >
      {draggable ? (
        <span className='absolute left-2 top-2 z-[2] cursor-grab text-muted opacity-0 transition-opacity group-hover:opacity-60'>
          <Icon name='gripVertical' size={16} />
        </span>
      ) : null}

      <div className='relative flex w-full flex-col items-start gap-3 px-4 py-4'>
        <button
          type='button'
          onClick={(): void => onOpen(list)}
          aria-label={`Open ${list.name}`}
          className='absolute inset-0 z-0 rounded-xl'
        />
        <span className='relative z-[1] pointer-events-none flex h-10 w-10 items-center justify-center rounded-xl bg-surface-hover text-muted'>
          <Icon name='list' size={20} />
        </span>
        <div className='relative z-[1] w-full'>
          <InlineRename
            value={list.name}
            onSave={(name: string): void => onRename(list.id, name)}
            className='text-[15px] font-semibold tracking-tight text-foreground'
            inputClassName='w-full rounded bg-surface-hover px-1 text-[15px] font-semibold outline-none'
          />
          <p className='pointer-events-none mt-1 text-xs text-muted'>
            {noteCount === 1 ? '1 note' : `${noteCount} notes`}
          </p>
        </div>
      </div>

      <div className='absolute right-2 top-2 z-[2] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100'>
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
