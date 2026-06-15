'use client'

import type { JSX, ReactNode } from 'react'

/**
 * Props for the vertical task list container.
 */
export interface TaskListProps {
  children: ReactNode
}

/**
 * Renders task rows in a single-column list.
 *
 * @param props.children Task rows to render.
 */
export function TaskList({ children }: TaskListProps): JSX.Element {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-2'>
      {children}
    </div>
  )
}
