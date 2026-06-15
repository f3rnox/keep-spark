'use client'

import type { JSX } from 'react'
import { TRASH_RETENTION_DAYS } from '../lib/purgeExpiredTrash'

/**
 * Props for the `TrashBanner` shown above the trash view.
 */
export interface TrashBannerProps {
  count: number
  onEmpty: () => void
}

/**
 * Compact info bar that appears at the top of the Trash view explaining the
 * auto-delete behavior and exposing a one-click "Empty trash" action.
 */
export function TrashBanner({ count, onEmpty }: TrashBannerProps): JSX.Element {
  return (
    <div className='mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted'>
      <span>Notes in Trash are deleted after {TRASH_RETENTION_DAYS} days.</span>
      <button
        type='button'
        onClick={onEmpty}
        disabled={count === 0}
        className='rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-transparent'
      >
        Empty trash
      </button>
    </div>
  )
}
