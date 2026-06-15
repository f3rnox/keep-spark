'use client'

import { useRef, useState, type FormEvent, type JSX } from 'react'
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
  onRename: (id: string, name: string) => void
  onDropNote: (listId: string, noteId: string) => void
  onReorderLists: (orderedIds: ReadonlyArray<string>) => void
}

/**
 * Overview of every named list with inline creation and per-list note counts.
 */
export function ListBrowser({
  lists,
  notes,
  onOpen,
  onCreate,
  onDelete,
  onRename,
  onDropNote,
  onReorderLists,
}: ListBrowserProps): JSX.Element {
  const [name, setName] = useState<string>('')
  const dragListIdRef = useRef<string | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const trimmed: string = name.trim()
    if (trimmed.length === 0) return
    onCreate(trimmed)
    setName('')
  }

  const handleReorder = (targetListId: string): void => {
    const fromId: string | null = dragListIdRef.current
    if (fromId === null || fromId === targetListId) return
    const ids: string[] = lists.map((list: NoteList): string => list.id)
    const fromIdx: number = ids.indexOf(fromId)
    const toIdx: number = ids.indexOf(targetListId)
    if (fromIdx < 0 || toIdx < 0) return
    const next: string[] = [...ids]
    next.splice(fromIdx, 1)
    next.splice(toIdx, 0, fromId)
    onReorderLists(next)
    dragListIdRef.current = null
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
                draggable
                onOpen={onOpen}
                onDelete={onDelete}
                onRename={onRename}
                onDropNote={onDropNote}
                onReorder={handleReorder}
                onDragStartList={(listId: string): void => {
                  dragListIdRef.current = listId
                }}
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  )
}
