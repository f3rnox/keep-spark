'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { NoteList } from './types'
import { createList } from './createList'
import { normalizeLabel } from './normalizeLabel'
import { setNotes } from './notesStore'
import {
  getListsServerSnapshot,
  getListsSnapshot,
  setLists,
  subscribeLists,
} from './listsStore'

/**
 * Patch describing partial fields that may be applied to an existing list.
 */
export type ListUpdate = Partial<Omit<NoteList, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Public API exposed by the `useLists` hook.
 */
export interface ListsApi {
  lists: ReadonlyArray<NoteList>
  addList: (name: string) => NoteList | null
  updateList: (id: string, patch: ListUpdate) => void
  deleteList: (id: string) => void
}

/**
 * Subscribes to the shared lists store and exposes referentially stable
 * mutators backed by `localStorage`.
 */
export function useLists(): ListsApi {
  const lists: ReadonlyArray<NoteList> = useSyncExternalStore(
    subscribeLists,
    getListsSnapshot,
    getListsServerSnapshot,
  )

  const addList = useCallback((name: string): NoteList | null => {
    const trimmed: string = normalizeLabel(name)
    if (trimmed.length === 0) return null

    const list: NoteList = createList(trimmed)
    setLists(
      (prev: ReadonlyArray<NoteList>): ReadonlyArray<NoteList> => [...prev, list],
    )
    return list
  }, [])

  const updateList = useCallback((id: string, patch: ListUpdate): void => {
    setLists(
      (prev: ReadonlyArray<NoteList>): ReadonlyArray<NoteList> =>
        prev.map(
          (list: NoteList): NoteList =>
            list.id === id
              ? {
                  ...list,
                  ...patch,
                  name:
                    patch.name !== undefined
                      ? normalizeLabel(patch.name) || list.name
                      : list.name,
                  updatedAt: Date.now(),
                }
              : list,
        ),
    )
  }, [])

  const deleteList = useCallback((id: string): void => {
    setLists(
      (prev: ReadonlyArray<NoteList>): ReadonlyArray<NoteList> =>
        prev.filter((list: NoteList): boolean => list.id !== id),
    )
    setNotes((prev) =>
      prev.map((note) =>
        note.listId === id ? { ...note, listId: null, updatedAt: Date.now() } : note,
      ),
    )
  }, [])

  return useMemo<ListsApi>(
    (): ListsApi => ({
      lists,
      addList,
      updateList,
      deleteList,
    }),
    [lists, addList, updateList, deleteList],
  )
}
