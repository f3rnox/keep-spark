'use client'

import type { JSX } from 'react'
import type { Note } from '../lib/types'

/**
 * Props for the backlinks panel in the note editor.
 */
export interface BacklinksPanelProps {
  backlinks: ReadonlyArray<Note>
  onOpen: (note: Note) => void
}

/**
 * Lists notes that link to the current note via `[[title]]` syntax.
 *
 * @param props.backlinks Notes referencing the current note.
 * @param props.onOpen Opens a backlinked note.
 */
export function BacklinksPanel({ backlinks, onOpen }: BacklinksPanelProps): JSX.Element | null {
  if (backlinks.length === 0) return null

  return (
    <div className='border-t border-border px-5 py-3'>
      <p className='mb-2 text-xs font-medium text-muted'>
        {backlinks.length === 1 ? '1 backlink' : `${backlinks.length} backlinks`}
      </p>
      <ul className='flex flex-col gap-1'>
        {backlinks.map(
          (note: Note): JSX.Element => (
            <li key={note.id}>
              <button
                type='button'
                onClick={(): void => onOpen(note)}
                className='text-sm text-accent underline-offset-2 hover:underline'
              >
                {note.title.length > 0 ? note.title : 'Untitled'}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
