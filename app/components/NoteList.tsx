'use client'

import type { JSX, ReactNode } from 'react'
import type { NoteLayout } from '../lib/types'

/**
 * Props for the note list container.
 */
export interface NoteListProps {
  layout: NoteLayout
  children: ReactNode
}

/**
 * Renders note tiles in either a masonry grid or a single-column stacked list.
 *
 * @param props.layout Active layout mode.
 * @param props.children Note tiles to render.
 */
export function NoteList({ layout, children }: NoteListProps): JSX.Element {
  if (layout === 'stacked') {
    return (
      <div className='mx-auto flex w-full max-w-2xl flex-col gap-3'>
        {children}
      </div>
    )
  }

  return (
    <div className='columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 [&>article]:mb-4 [&>article]:break-inside-avoid'>
      {children}
    </div>
  )
}
