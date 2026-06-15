import type { ListFilter, Note, NoteView } from './types'

/**
 * Lower-cases and trims a search query before substring matching.
 *
 * @param query The raw search input.
 */
function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

/**
 * Returns whether a note matches the supplied list filter.
 *
 * @param note Note to test.
 * @param listFilter Scope controlling list membership.
 */
function matchesListFilter(note: Note, listFilter: ListFilter): boolean {
  if (listFilter === 'all') return true
  if (listFilter === 'inbox') return note.listId === null
  return note.listId === listFilter
}

/**
 * Filters the supplied notes down to those that belong to the given view and
 * match the (optional) full-text search query and label filter.
 *
 * @param notes The full notes collection.
 * @param view Active high-level filter (notes/archive/trash/lists).
 * @param query Optional case-insensitive substring query.
 * @param listFilter Optional list scope; defaults to `all`.
 * @param labelFilter Optional exact label to match; null shows all.
 */
export function filterNotes(
  notes: ReadonlyArray<Note>,
  view: NoteView,
  query: string,
  listFilter: ListFilter = 'all',
  labelFilter: string | null = null,
): ReadonlyArray<Note> {
  const normalized: string = normalizeQuery(query)

  return notes.filter((note: Note): boolean => {
    if (view === 'trash') {
      if (!note.trashed) return false
    } else if (view === 'archive') {
      if (note.trashed || !note.archived) return false
    } else {
      if (note.trashed || note.archived) return false
      if (!matchesListFilter(note, listFilter)) return false
    }

    if (labelFilter !== null) {
      const hasLabel: boolean = note.labels.some(
        (label: string): boolean => label.toLowerCase() === labelFilter.toLowerCase(),
      )
      if (!hasLabel) return false
    }

    if (normalized.length === 0) return true

    return (
      note.title.toLowerCase().includes(normalized) ||
      note.content.toLowerCase().includes(normalized) ||
      note.labels.some((label: string): boolean =>
        label.toLowerCase().includes(normalized),
      )
    )
  })
}
