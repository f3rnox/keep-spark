import { createNote } from './createNote'
import type { Note } from './types'

/**
 * Creates a one-line task note with checkbox completion state.
 *
 * @param title Task label text.
 * @param listId Optional list to assign the task to.
 */
export function createTask(title: string, listId: string | null = null): Note {
  const trimmed: string = title.trim()
  return {
    ...createNote(trimmed, ''),
    listId,
    isTask: true,
    taskDone: false,
  }
}
