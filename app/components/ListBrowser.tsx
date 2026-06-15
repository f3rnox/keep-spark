'use client'

import { useState, type FormEvent, type JSX } from 'react'
import type { Note, NoteList } from '../lib/types'
import { countListNotes } from '../lib/countListNotes'
import { ListCard } from './ListCard'

/**
 * Props for the lists overview grid.
 */
export interface ListBrowserProps {
  lists: ReadonlyArray<NoteList>
  notes: ReadonlyArray<Note>
  onOpen: (list: NoteList) => void
  onCreate: (name: string) => void
  onDelete: (id: string) => void
}

/**
 * Overview of every named list with inline creation and per-list note counts.
 *
 * @param props.lists All saved lists.
 * @param props.notes Full notes collection used to compute counts.
 * @param props.onOpen Opens a list detail view.
 * @param props.onCreate Creates a new list from the inline form.
 * @param props.onDelete Deletes a list and returns its notes to the inbox.
 */
export function ListBrowser({
  lists,
  notes,
  onOpen,
  onCreate,
  onDelete,
}: ListBrowserProps): JSX.Element {
  const [name, setName] = useState<string>('')

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const trimmed: string = name.trim()
    if (trimmed.length === 0) return
    onCreate(trimmed)
    setName('')
  }

  return (
    <div className='flex flex-col gap-8'>
      <form
        onSubmit={submit}
        className='mx-auto flex w-full max-w-2xl items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2'
      >
        <input
          type='text'
          value={name}
          onChange={(event): void => setName(event.target.value)}
          placeholder='New list name'
          className='min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted'
        />
        <button
          type='submit'
          disabled={name.trim().length === 0}
          className='rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-on-accent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40'
        >
          Create
        </button>
      </form>

      {lists.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {lists.map(
            (list: NoteList): JSX.Element => (
              <ListCard
                key={list.id}
                list={list}
                noteCount={countListNotes(notes, list.id)}
                onOpen={onOpen}
                onDelete={onDelete}
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  )
}
