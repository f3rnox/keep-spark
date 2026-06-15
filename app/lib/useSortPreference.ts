'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { NoteSort } from './types'
import {
  getSortServerSnapshot,
  getSortSnapshot,
  setSort,
  subscribeSort,
} from './sortStore'

/**
 * Public API for the sort preference hook.
 */
export interface SortPreferenceApi {
  sort: NoteSort
  setSort: (next: NoteSort) => void
}

/**
 * Subscribes to the persisted note sort preference.
 */
export function useSortPreference(): SortPreferenceApi {
  const sort: NoteSort = useSyncExternalStore(
    subscribeSort,
    getSortSnapshot,
    getSortServerSnapshot,
  )

  const update = useCallback((next: NoteSort): void => {
    setSort(next)
  }, [])

  return useMemo<SortPreferenceApi>(
    (): SortPreferenceApi => ({ sort, setSort: update }),
    [sort, update],
  )
}
