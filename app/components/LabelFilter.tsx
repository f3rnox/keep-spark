'use client'

import type { JSX } from 'react'

/**
 * Props for the label filter chip bar.
 */
export interface LabelFilterProps {
  labels: ReadonlyArray<string>
  selected: string | null
  onSelect: (label: string | null) => void
}

/**
 * Horizontal chip bar for filtering notes by label.
 *
 * @param props.labels All available labels.
 * @param props.selected Currently active label filter, or null for all.
 * @param props.onSelect Invoked when the user picks a label.
 */
export function LabelFilter({
  labels,
  selected,
  onSelect,
}: LabelFilterProps): JSX.Element | null {
  if (labels.length === 0) return null

  return (
    <div className='flex flex-wrap items-center gap-2 border-t border-border py-2 pl-0 sm:pl-3'>
      <span className='text-xs font-medium text-muted'>Labels</span>
      <button
        type='button'
        onClick={(): void => onSelect(null)}
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
          selected === null
            ? 'bg-accent text-on-accent'
            : 'bg-surface-hover text-muted hover:text-foreground'
        }`}
      >
        All
      </button>
      {labels.map(
        (label: string): JSX.Element => (
          <button
            key={label}
            type='button'
            onClick={(): void => onSelect(label)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
              selected?.toLowerCase() === label.toLowerCase()
                ? 'bg-accent text-on-accent'
                : 'bg-surface-hover text-muted hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ),
      )}
    </div>
  )
}
