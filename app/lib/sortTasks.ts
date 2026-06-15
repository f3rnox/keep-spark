import type { Note } from './types'

/**
 * Active and completed task buckets sorted by most recently updated.
 */
export interface SortedTasks {
  active: ReadonlyArray<Note>
  completed: ReadonlyArray<Note>
}

/**
 * Splits tasks into active and completed groups, newest first within each.
 *
 * @param tasks Task notes to order.
 */
export function sortTasks(tasks: ReadonlyArray<Note>): SortedTasks {
  const active: Note[] = []
  const completed: Note[] = []

  for (const task of tasks) {
    if (task.taskDone) completed.push(task)
    else active.push(task)
  }

  const byUpdated = (a: Note, b: Note): number => b.updatedAt - a.updatedAt
  active.sort(byUpdated)
  completed.sort(byUpdated)

  return { active, completed }
}
