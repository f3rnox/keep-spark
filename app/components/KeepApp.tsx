'use client'

import { useMemo, useState, type JSX } from 'react'
import type { Note, NoteColor, NoteView } from '../lib/types'
import { filterNotes } from '../lib/filterNotes'
import { partitionPinned } from '../lib/partitionPinned'
import { useNotes } from '../lib/useNotes'
import { EditNoteModal } from './EditNoteModal'
import { EmptyState } from './EmptyState'
import { Header } from './Header'
import { LayoutSelector } from './LayoutSelector'
import { NavTabs } from './NavTabs'
import { NoteCard } from './NoteCard'
import { NoteEditor } from './NoteEditor'
import { NoteList } from './NoteList'
import { NoteSection } from './NoteSection'
import { TrashBanner } from './TrashBanner'
import { useNoteLayout } from '../lib/useNoteLayout'

/**
 * Top-level Google Keep clone shell. Owns view selection, sidebar collapse
 * state, search query, and the currently-edited note. Delegates persistence
 * to `useNotes`.
 */
export function KeepApp(): JSX.Element {
  const {
    notes,
    addNote,
    updateNote,
    togglePinned,
    setArchived,
    setTrashed,
    deleteForever,
    emptyTrash,
  } = useNotes()

  const [view, setView] = useState<NoteView>('notes')
  const [query, setQuery] = useState<string>('')
  const [editing, setEditing] = useState<Note | null>(null)
  const { layout, setLayout } = useNoteLayout()

  const counts = useMemo<Record<NoteView, number>>(
    (): Record<NoteView, number> => ({
      notes: notes.filter((note: Note): boolean => !note.trashed && !note.archived).length,
      archive: notes.filter((note: Note): boolean => !note.trashed && note.archived).length,
      trash: notes.filter((note: Note): boolean => note.trashed).length,
    }),
    [notes],
  )

  const visibleNotes: ReadonlyArray<Note> = useMemo(
    (): ReadonlyArray<Note> => filterNotes(notes, view, query),
    [notes, view, query],
  )

  const { pinned, others } = useMemo(
    () => partitionPinned(visibleNotes),
    [visibleNotes],
  )

  const editingNote: Note | null = useMemo<Note | null>((): Note | null => {
    if (!editing) return null
    return notes.find((note: Note): boolean => note.id === editing.id) ?? null
  }, [editing, notes])

  const renderCard = (note: Note): JSX.Element => (
    <NoteCard
      key={note.id}
      note={note}
      view={view}
      onOpen={(target: Note): void => setEditing(target)}
      onTogglePinned={togglePinned}
      onSetArchived={setArchived}
      onSetTrashed={setTrashed}
      onDeleteForever={deleteForever}
      onChangeColor={(id: string, color: NoteColor): void => updateNote(id, { color })}
    />
  )

  const showEditor: boolean = view === 'notes'
  const searching: boolean = query.trim().length > 0

  return (
    <div className='flex min-h-full flex-1 flex-col bg-canvas text-foreground'>
      <Header query={query} onQueryChange={setQuery} />

      <div className='sticky top-16 z-20 border-b border-border bg-canvas/80 backdrop-blur'>
        <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
          <NavTabs view={view} counts={counts} onSelect={setView} />
          <LayoutSelector layout={layout} onChange={setLayout} />
        </div>
      </div>

      <main className='mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6'>
        {showEditor ? (
          <div className='mb-12'>
            <NoteEditor
              onCreate={(
                title: string,
                content: string,
                color: NoteColor,
                labels: ReadonlyArray<string>,
              ): void => {
                addNote(title, content, color, labels)
              }}
            />
          </div>
        ) : null}

        {view === 'trash' ? (
          <TrashBanner count={counts.trash} onEmpty={emptyTrash} />
        ) : null}

        {visibleNotes.length === 0 ? (
          <EmptyState view={view} searching={searching} />
        ) : view === 'notes' && pinned.length > 0 && others.length > 0 ? (
          <>
            <NoteSection label='Pinned'>
              <NoteList layout={layout}>{pinned.map(renderCard)}</NoteList>
            </NoteSection>
            <NoteSection label='Others'>
              <NoteList layout={layout}>{others.map(renderCard)}</NoteList>
            </NoteSection>
          </>
        ) : (
          <NoteSection>
            <NoteList layout={layout}>{visibleNotes.map(renderCard)}</NoteList>
          </NoteSection>
        )}
      </main>

      {editingNote ? (
        <EditNoteModal
          note={editingNote}
          onSave={(
            id: string,
            patch: {
              title: string
              content: string
              color: NoteColor
              labels: ReadonlyArray<string>
            },
          ): void => updateNote(id, patch)}
          onTogglePinned={togglePinned}
          onSetArchived={setArchived}
          onSetTrashed={setTrashed}
          onClose={(): void => setEditing(null)}
        />
      ) : null}
    </div>
  )
}
