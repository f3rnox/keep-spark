'use client'

import { useCallback, useMemo, useRef, useState, type JSX } from 'react'
import type { ListFilter, Note, NoteColor, NoteList as NamedList, NoteView } from '../lib/types'
import { collectLabels } from '../lib/collectLabels'
import { filterNotes } from '../lib/filterNotes'
import { findNoteByTitle } from '../lib/findNoteByTitle'
import { partitionPinned } from '../lib/partitionPinned'
import { reorderNotesInSection } from '../lib/reorderNotesInSection'
import { sortNotes } from '../lib/sortNotes'
import { setSort } from '../lib/sortStore'
import { useAppShortcuts } from '../lib/useAppShortcuts'
import { useLists } from '../lib/useLists'
import { useNotes } from '../lib/useNotes'
import { useSortPreference } from '../lib/useSortPreference'
import { EditNoteModal } from './EditNoteModal'
import { EmptyState } from './EmptyState'
import { Header } from './Header'
import { LabelFilter } from './LabelFilter'
import { LayoutSelector } from './LayoutSelector'
import { ListBrowser } from './ListBrowser'
import { ListDetailHeader } from './ListDetailHeader'
import { NavTabs } from './NavTabs'
import { NoteCard } from './NoteCard'
import { NoteEditor, type NoteEditorHandle } from './NoteEditor'
import { NoteList } from './NoteList'
import { NoteSection } from './NoteSection'
import { SortSelector } from './SortSelector'
import { TrashBanner } from './TrashBanner'
import { useNoteLayout } from '../lib/useNoteLayout'

/**
 * Top-level KeepSpark shell. Owns view selection, search query, and the
 * currently-edited note. Delegates persistence to `useNotes` and `useLists`.
 */
export function KeepSparkApp(): JSX.Element {
  const {
    notes,
    addNote,
    updateNote,
    togglePinned,
    setArchived,
    setTrashed,
    setListId,
    deleteForever,
    emptyTrash,
    reorderNotes,
  } = useNotes()

  const { lists, addList, updateList, deleteList, reorderLists } = useLists()
  const { sort, setSort: setSortPreference } = useSortPreference()

  const [view, setView] = useState<NoteView>('notes')
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [query, setQuery] = useState<string>('')
  const [labelFilter, setLabelFilter] = useState<string | null>(null)
  const [editing, setEditing] = useState<Note | null>(null)
  const { layout, setLayout } = useNoteLayout()

  const searchRef = useRef<HTMLInputElement | null>(null)
  const editorRef = useRef<NoteEditorHandle | null>(null)
  const dragNoteIdRef = useRef<string | null>(null)

  const selectedList: NamedList | null = useMemo<NamedList | null>((): NamedList | null => {
    if (!selectedListId) return null
    return lists.find((list: NamedList): boolean => list.id === selectedListId) ?? null
  }, [lists, selectedListId])

  const listNameById: Map<string, string> = useMemo((): Map<string, string> => {
    const map: Map<string, string> = new Map()
    for (const list of lists) map.set(list.id, list.name)
    return map
  }, [lists])

  const counts = useMemo<Record<NoteView, number>>(
    (): Record<NoteView, number> => ({
      notes: notes.filter(
        (note: Note): boolean => !note.trashed && !note.archived,
      ).length,
      lists: lists.length,
      archive: notes.filter((note: Note): boolean => !note.trashed && note.archived).length,
      trash: notes.filter((note: Note): boolean => note.trashed).length,
    }),
    [notes, lists],
  )

  const listFilter: ListFilter = useMemo((): ListFilter => {
    if (view === 'lists' && selectedListId) return selectedListId
    return 'all'
  }, [view, selectedListId])

  const filteredNotes: ReadonlyArray<Note> = useMemo(
    (): ReadonlyArray<Note> =>
      filterNotes(notes, view, query, listFilter, labelFilter),
    [notes, view, query, listFilter, labelFilter],
  )

  const sortedNotes: ReadonlyArray<Note> = useMemo(
    (): ReadonlyArray<Note> => sortNotes(filteredNotes, sort),
    [filteredNotes, sort],
  )

  const { pinned, others } = useMemo(
    () => partitionPinned(sortedNotes),
    [sortedNotes],
  )

  const availableLabels: ReadonlyArray<string> = useMemo((): ReadonlyArray<string> => {
    const active: ReadonlyArray<Note> = notes.filter(
      (note: Note): boolean => !note.trashed && !note.archived,
    )
    return collectLabels(active)
  }, [notes])

  const editingNote: Note | null = useMemo<Note | null>((): Note | null => {
    if (!editing) return null
    return notes.find((note: Note): boolean => note.id === editing.id) ?? null
  }, [editing, notes])

  const handleSelectView = (next: NoteView): void => {
    setView(next)
    setSelectedListId(null)
    setLabelFilter(null)
  }

  const handleNoteDrop = useCallback(
    (sectionNotes: ReadonlyArray<Note>, targetId: string): void => {
      const fromId: string | null = dragNoteIdRef.current
      if (fromId === null || fromId === targetId) return
      const orderedIds: ReadonlyArray<string> = reorderNotesInSection(
        notes,
        sectionNotes,
        fromId,
        targetId,
      )
      reorderNotes(orderedIds)
      setSort('custom')
      setSortPreference('custom')
      dragNoteIdRef.current = null
    },
    [notes, reorderNotes, setSortPreference],
  )

  const handleOpenNoteLink = useCallback(
    (title: string): void => {
      const target: Note | null = findNoteByTitle(notes, title)
      if (target) setEditing(target)
    },
    [notes],
  )

  const closeModal = useCallback((): void => setEditing(null), [])

  useAppShortcuts({
    onNewNote: (): void => {
      if (view !== 'notes' && !(view === 'lists' && selectedListId)) return
      editorRef.current?.expand()
    },
    onFocusSearch: (): void => searchRef.current?.focus(),
    onCloseModal: closeModal,
    onTogglePin: (): void => {
      if (editingNote) togglePinned(editingNote.id)
    },
    modalOpen: editingNote !== null,
  })

  const renderCard = (note: Note, sectionNotes: ReadonlyArray<Note>): JSX.Element => {
    const listName: string | null =
      note.listId !== null ? (listNameById.get(note.listId) ?? null) : null

    return (
      <NoteCard
        key={note.id}
        note={note}
        view={view}
        lists={lists}
        listName={view === 'notes' ? listName : null}
        draggable={!editingNote}
        onOpen={(target: Note): void => setEditing(target)}
        onTogglePinned={togglePinned}
        onSetArchived={setArchived}
        onSetTrashed={setTrashed}
        onDeleteForever={deleteForever}
        onChangeColor={(id: string, color: NoteColor): void => updateNote(id, { color })}
        onSetListId={setListId}
        onCreateList={addList}
        onContentChange={(id: string, content: string): void => updateNote(id, { content })}
        onLabelClick={(label: string): void => {
          setView('notes')
          setSelectedListId(null)
          setLabelFilter(label)
        }}
        onNoteLinkClick={handleOpenNoteLink}
        onDragStart={(id: string): void => {
          dragNoteIdRef.current = id
        }}
        onDrop={(targetId: string): void => handleNoteDrop(sectionNotes, targetId)}
      />
    )
  }

  const showEditor: boolean =
    view === 'notes' || (view === 'lists' && selectedListId !== null)
  const searching: boolean = query.trim().length > 0
  const browsingLists: boolean = view === 'lists' && selectedListId === null
  const editorListId: string | null =
    view === 'lists' && selectedListId ? selectedListId : null

  const renderNotes = (): JSX.Element => {
    if (sortedNotes.length === 0) {
      return (
        <EmptyState
          view={view}
          searching={searching || labelFilter !== null}
          inList={view === 'lists' && selectedListId !== null}
        />
      )
    }

    if (
      (view === 'notes' || (view === 'lists' && selectedListId)) &&
      pinned.length > 0 &&
      others.length > 0
    ) {
      return (
        <>
          <NoteSection label='Pinned'>
            <NoteList layout={layout}>{pinned.map((note: Note) => renderCard(note, pinned))}</NoteList>
          </NoteSection>
          <NoteSection label='Others'>
            <NoteList layout={layout}>{others.map((note: Note) => renderCard(note, others))}</NoteList>
          </NoteSection>
        </>
      )
    }

    return (
      <NoteSection>
        <NoteList layout={layout}>
          {sortedNotes.map((note: Note) => renderCard(note, sortedNotes))}
        </NoteList>
      </NoteSection>
    )
  }

  return (
    <div className='flex min-h-full flex-1 flex-col bg-canvas text-foreground'>
      <Header ref={searchRef} query={query} onQueryChange={setQuery} />

      <div className='sticky top-16 z-20 border-b border-border bg-canvas/80 backdrop-blur'>
        <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
          <div className='flex items-center justify-between gap-4'>
            <NavTabs view={view} counts={counts} onSelect={handleSelectView} />
            {!browsingLists ? (
              <div className='flex items-center gap-3'>
                <SortSelector sort={sort} onChange={setSortPreference} />
                <LayoutSelector layout={layout} onChange={setLayout} />
              </div>
            ) : null}
          </div>
          {!browsingLists && view !== 'trash' ? (
            <LabelFilter
              labels={availableLabels}
              selected={labelFilter}
              onSelect={setLabelFilter}
            />
          ) : null}
        </div>
      </div>

      <main className='mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6'>
        {browsingLists ? (
          <>
            <ListBrowser
              lists={lists}
              notes={notes}
              onOpen={(list: NamedList): void => setSelectedListId(list.id)}
              onCreate={addList}
              onDelete={deleteList}
              onRename={(id: string, name: string): void => updateList(id, { name })}
              onDropNote={(listId: string, noteId: string): void => {
                setListId(noteId, listId)
              }}
              onReorderLists={reorderLists}
            />
            {lists.length === 0 ? (
              <EmptyState view='lists' searching={false} />
            ) : null}
          </>
        ) : (
          <>
            {view === 'lists' && selectedList ? (
              <ListDetailHeader
                list={selectedList}
                onBack={(): void => setSelectedListId(null)}
                onRename={(id: string, name: string): void => updateList(id, { name })}
              />
            ) : null}

            {showEditor ? (
              <div className='mb-12'>
                <NoteEditor
                  ref={editorRef}
                  listId={editorListId}
                  onCreate={(
                    title: string,
                    content: string,
                    color: NoteColor,
                    labels: ReadonlyArray<string>,
                    listId?: string | null,
                  ): void => {
                    addNote(title, content, color, labels, listId ?? null)
                  }}
                />
              </div>
            ) : null}

            {view === 'trash' ? (
              <TrashBanner count={counts.trash} onEmpty={emptyTrash} />
            ) : null}

            {renderNotes()}
          </>
        )}
      </main>

      {editingNote ? (
        <EditNoteModal
          note={editingNote}
          notes={notes}
          lists={lists}
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
          onSetListId={setListId}
          onCreateList={addList}
          onOpenNote={(note: Note): void => setEditing(note)}
          onClose={closeModal}
        />
      ) : null}
    </div>
  )
}
