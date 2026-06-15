import type { Note } from './types'
import { isNoteTask } from './isNoteTask'

/**
 * Result of splitting a collection into tasks and regular notes.
 */
export interface NotesAndTasksPartition {
  tasks: ReadonlyArray<Note>
  notes: ReadonlyArray<Note>
}

/**
 * Separates checkbox tasks from regular notes while preserving order.
 *
 * @param items Filtered notes collection.
 */
export function partitionNotesAndTasks(
  items: ReadonlyArray<Note>,
): NotesAndTasksPartition {
  const tasks: Note[] = []
  const notes: Note[] = []

  for (const item of items) {
    if (isNoteTask(item)) tasks.push(item)
    else notes.push(item)
  }

  return { tasks, notes }
}
