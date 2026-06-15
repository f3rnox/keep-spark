'use client'

import {
  useCallback,
  useEffect,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { KeyboardShortcutsList } from './KeyboardShortcutsList'

/**
 * Props for the keyboard shortcuts help modal.
 */
export interface KeyboardShortcutsModalProps {
  onClose: () => void
}

/**
 * Modal overlay listing app keyboard shortcuts.
 *
 * @param props.onClose Invoked when the user dismisses the dialog.
 */
export function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps): JSX.Element {
  const stopPropagation = useCallback((event: MouseEvent | ReactKeyboardEvent): void => {
    event.stopPropagation()
  }, [])

  useEffect((): (() => void) => {
    const handler = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handler)
    return (): void => document.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Keyboard shortcuts'
      onClick={onClose}
      className='fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4'
    >
      <div
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
        className='flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-surface text-foreground shadow-2xl shadow-black/20 sm:max-h-[85vh] sm:rounded-2xl'
      >
        <div className='flex items-center justify-between gap-3 border-b border-border px-5 py-4'>
          <div className='flex items-center gap-2.5'>
            <Icon name='keyboard' size={20} className='text-muted' />
            <div>
              <h2 className='text-base font-semibold tracking-tight'>Keyboard shortcuts</h2>
              <p className='text-xs text-muted'>
                Available when focus is not inside a text field.
              </p>
            </div>
          </div>
          <IconButton label='Close shortcuts' onClick={onClose}>
            <Icon name='close' size={18} />
          </IconButton>
        </div>

        <div className='overflow-y-auto'>
          <KeyboardShortcutsList />
        </div>
      </div>
    </div>,
    document.body,
  )
}
