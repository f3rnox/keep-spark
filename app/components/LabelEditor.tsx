'use client'

import {
  useCallback,
  useState,
  type ChangeEvent,
  type JSX,
  type KeyboardEvent,
} from 'react'
import { normalizeLabel } from '../lib/normalizeLabel'
import { Icon } from './Icon'

/**
 * Props for the inline label editor used in note compose/edit surfaces.
 */
export interface LabelEditorProps {
  labels: ReadonlyArray<string>
  onChange: (labels: ReadonlyArray<string>) => void
}

/**
 * Chip list with an input for adding and removing note labels.
 *
 * @param props.labels Current label list.
 * @param props.onChange Called when labels are added or removed.
 */
export function LabelEditor({ labels, onChange }: LabelEditorProps): JSX.Element {
  const [draft, setDraft] = useState<string>('')

  const addLabel = useCallback(
    (raw: string): void => {
      const next: string = normalizeLabel(raw)
      if (next.length === 0) return
      const exists: boolean = labels.some(
        (label: string): boolean => label.toLowerCase() === next.toLowerCase(),
      )
      if (exists) {
        setDraft('')
        return
      }
      onChange([...labels, next])
      setDraft('')
    },
    [labels, onChange],
  )

  const removeLabel = useCallback(
    (target: string): void => {
      onChange(labels.filter((label: string): boolean => label !== target))
    },
    [labels, onChange],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addLabel(draft)
    }
    if (event.key === 'Backspace' && draft.length === 0 && labels.length > 0) {
      removeLabel(labels[labels.length - 1] ?? '')
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {labels.map(
        (label: string): JSX.Element => (
          <span
            key={label}
            className='inline-flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-medium text-foreground'
          >
            {label}
            <button
              type='button'
              aria-label={`Remove label ${label}`}
              onClick={(): void => removeLabel(label)}
              className='inline-flex h-4 w-4 items-center justify-center rounded-full text-muted transition-colors hover:bg-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <Icon name='close' size={12} />
            </button>
          </span>
        ),
      )}
      <input
        type='text'
        value={draft}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={(): void => addLabel(draft)}
        placeholder={labels.length === 0 ? 'Add label' : 'Add another label'}
        className='min-w-[7rem] flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted'
      />
    </div>
  )
}
