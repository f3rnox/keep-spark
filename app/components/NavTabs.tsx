'use client'

import type { JSX } from 'react'
import type { NoteView } from '../lib/types'

/**
 * Props for the horizontal `NavTabs` navigation.
 */
export interface NavTabsProps {
  view: NoteView
  counts: Record<NoteView, number>
  onSelect: (next: NoteView) => void
}

interface NavTab {
  id: NoteView
  label: string
}

const TABS: ReadonlyArray<NavTab> = [
  { id: 'notes', label: 'Notes' },
  { id: 'lists', label: 'Lists' },
  { id: 'archive', label: 'Archive' },
  { id: 'trash', label: 'Trash' },
]

/**
 * Minimal text-based view switcher rendered beneath the header. The active tab
 * is marked with an underline accent; each tab surfaces its note count.
 *
 * @param props.view The currently active view.
 * @param props.counts Per-view counts shown beside each label.
 * @param props.onSelect Invoked when the user selects a different view.
 */
export function NavTabs({ view, counts, onSelect }: NavTabsProps): JSX.Element {
  return (
    <nav aria-label='Primary' className='flex items-center gap-1'>
      {TABS.map((tab: NavTab): JSX.Element => {
        const active: boolean = tab.id === view
        return (
          <button
            key={tab.id}
            type='button'
            onClick={(): void => onSelect(tab.id)}
            aria-current={active ? 'page' : undefined}
            className={`relative -mb-px flex items-center gap-2 px-3 py-3 text-sm transition-colors ${
              active
                ? 'font-medium text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] tabular-nums transition-colors ${
                active
                  ? 'bg-accent text-on-accent'
                  : 'bg-surface-hover text-muted'
              }`}
            >
              {counts[tab.id]}
            </span>
            {active ? (
              <span className='absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent' />
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}
