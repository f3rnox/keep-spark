'use client'

import type { JSX } from 'react'
import type { NoteView } from '../lib/types'
import { Icon, type IconName } from './Icon'

/**
 * Props for the `EmptyState` placeholder.
 */
export interface EmptyStateProps {
  view: NoteView
  searching: boolean
  inList?: boolean
}

interface EmptyConfig {
  icon: IconName
  title: string
}

const EMPTY: Record<NoteView, EmptyConfig> = {
  notes: { icon: 'lightbulb', title: 'Notes you add appear here' },
  lists: { icon: 'list', title: 'Create a list to organize your notes' },
  archive: { icon: 'archive', title: 'Your archived notes appear here' },
  trash: { icon: 'trash', title: 'No notes in Trash' },
}

/**
 * Renders a friendly placeholder when the active view has no notes to show,
 * adapting its message based on whether the user is searching or simply has
 * an empty bucket.
 *
 * @param props.view The current view, controlling icon/title.
 * @param props.searching True when a search query is active.
 */
export function EmptyState({ view, searching, inList = false }: EmptyStateProps): JSX.Element {
  const config = EMPTY[view]
  const title: string = searching
    ? 'No matching notes found'
    : inList
      ? 'No notes in this list'
      : config.title

  return (
    <div className='flex flex-col items-center justify-center px-6 py-28 text-center'>
      <span className='mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-muted'>
        <Icon name={config.icon} size={28} strokeWidth={1.5} />
      </span>
      <p className='text-sm text-muted'>{title}</p>
    </div>
  )
}
