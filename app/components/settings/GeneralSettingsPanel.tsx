'use client'

import type { JSX } from 'react'
import type { EditorPane, NoteLayout, NoteSort } from '../../lib/types'
import { useNoteLayout } from '../../lib/useNoteLayout'
import { useSortPreference } from '../../lib/useSortPreference'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

const SORT_OPTIONS: ReadonlyArray<{ value: NoteSort; label: string }> = [
  { value: 'updated', label: 'Recently edited' },
  { value: 'created', label: 'Date created' },
  { value: 'title', label: 'Title' },
  { value: 'color', label: 'Color' },
  { value: 'due', label: 'Due date' },
  { value: 'custom', label: 'Custom order' },
]

/**
 * General settings for default note browsing behavior.
 */
export function GeneralSettingsPanel(): JSX.Element {
  const { sort, setSort } = useSortPreference()
  const { layout, setLayout, editorPane, setEditorPane } = useNoteLayout()

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Note browsing'
        description='Choose how notes are ordered and laid out when you open the app.'
      >
        <SettingsRow
          label='Default sort'
          description='Applied across notes, lists, archive, and trash views.'
        >
          <select
            value={sort}
            onChange={(event): void => setSort(event.target.value as NoteSort)}
            className='min-w-40 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring'
            aria-label='Default sort order'
          >
            {SORT_OPTIONS.map(
              (option): JSX.Element => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
        </SettingsRow>

        <SettingsRow
          label='Note layout'
          description='Switch between a masonry grid and a compact stacked list.'
        >
          <div className='inline-flex rounded-lg border border-border bg-canvas p-1'>
            {(['grid', 'stacked'] as const).map((value: NoteLayout): JSX.Element => {
              const active: boolean = layout === value
              return (
                <button
                  key={value}
                  type='button'
                  onClick={(): void => setLayout(value)}
                  aria-pressed={active}
                  className={`rounded-md px-3 py-1.5 text-sm capitalize transition-colors ${
                    active
                      ? 'bg-accent text-on-accent'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </SettingsRow>

        <SettingsRow
          label='Editor layout'
          description='On wide screens, keep the note grid visible while editing in a side panel.'
        >
          <div className='inline-flex rounded-lg border border-border bg-canvas p-1'>
            {(['overlay', 'split'] as const).map((value: EditorPane): JSX.Element => {
              const active: boolean = editorPane === value
              return (
                <button
                  key={value}
                  type='button'
                  onClick={(): void => setEditorPane(value)}
                  aria-pressed={active}
                  className={`rounded-md px-3 py-1.5 text-sm capitalize transition-colors ${
                    active
                      ? 'bg-accent text-on-accent'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {value === 'split' ? 'Split pane' : 'Overlay'}
                </button>
              )
            })}
          </div>
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
