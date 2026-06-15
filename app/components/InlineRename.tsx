'use client'

import { useEffect, useRef, useState, type JSX, type KeyboardEvent } from 'react'
import { Icon } from './Icon'

/**
 * Props for the inline rename control.
 */
export interface InlineRenameProps {
  value: string
  onSave: (next: string) => void
  className?: string
  inputClassName?: string
}

/**
 * Click-to-edit text that saves on blur or Enter and cancels on Escape.
 *
 * @param props.value Current display value.
 * @param props.onSave Persists the trimmed new value.
 * @param props.className Classes applied to the display button.
 * @param props.inputClassName Classes applied to the edit input.
 */
export function InlineRename({
  value,
  onSave,
  className = '',
  inputClassName = '',
}: InlineRenameProps): JSX.Element {
  const [editing, setEditing] = useState<boolean>(false)
  const [draft, setDraft] = useState<string>(value)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const startEditing = (): void => {
    setDraft(value)
    setEditing(true)
  }

  useEffect((): void => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  const commit = (): void => {
    const trimmed: string = draft.trim()
    if (trimmed.length > 0 && trimmed !== value) onSave(trimmed)
    setEditing(false)
  }

  const cancel = (): void => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type='text'
        value={draft}
        onChange={(event): void => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>): void => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit()
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            cancel()
          }
        }}
        className={inputClassName}
      />
    )
  }

  return (
    <button
      type='button'
      onClick={startEditing}
      className={`group/rename inline-flex items-center gap-1.5 text-left ${className}`}
    >
      <span>{value}</span>
      <Icon
        name='edit'
        size={14}
        className='text-muted opacity-0 transition-opacity group-hover/rename:opacity-100'
      />
    </button>
  )
}
