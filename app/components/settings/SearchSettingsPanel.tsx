'use client'

import type { JSX } from 'react'
import { useRecentSearches } from '../../lib/useRecentSearches'
import { Icon } from '../Icon'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

/**
 * Search-related settings for recent query history.
 */
export function SearchSettingsPanel(): JSX.Element {
  const { recents, removeRecent, clearRecents } = useRecentSearches()

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Recent searches'
        description='Queries you commit from the header search field appear here for quick reuse.'
      >
        {recents.length === 0 ? (
          <div className='px-4 py-6 text-sm text-muted'>No recent searches yet.</div>
        ) : (
          recents.map(
            (query: string): JSX.Element => (
              <SettingsRow key={query} label={query} description='Saved on this device'>
                <button
                  type='button'
                  aria-label={`Remove ${query}`}
                  onClick={(): void => removeRecent(query)}
                  className='rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground'
                >
                  <Icon name='close' size={16} />
                </button>
              </SettingsRow>
            ),
          )
        )}
      </SettingsSection>

      {recents.length > 0 ? (
        <button
          type='button'
          onClick={clearRecents}
          className='rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-hover'
        >
          Clear all recent searches
        </button>
      ) : null}
    </div>
  )
}
