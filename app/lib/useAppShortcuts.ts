'use client'

import { useEffect } from 'react'

/**
 * Options for the global keyboard shortcut handler.
 */
export interface AppShortcutsOptions {
  onNewNote: () => void
  onFocusSearch: () => void
  onCloseModal: () => void
  onTogglePin: () => void
  modalOpen: boolean
}

/**
 * Registers app-level keyboard shortcuts when no text input is focused.
 *
 * @param options Shortcut callbacks and modal state.
 */
export function useAppShortcuts(options: AppShortcutsOptions): void {
  const { onNewNote, onFocusSearch, onCloseModal, onTogglePin, modalOpen } = options

  useEffect((): (() => void) => {
    const handler = (event: KeyboardEvent): void => {
      const target: EventTarget | null = event.target
      const tag: string =
        target instanceof HTMLElement ? target.tagName.toLowerCase() : ''
      const isTyping: boolean =
        tag === 'input' ||
        tag === 'textarea' ||
        (target instanceof HTMLElement && target.isContentEditable)

      if (event.key === 'Escape' && modalOpen) {
        event.preventDefault()
        onCloseModal()
        return
      }

      if (isTyping) return

      if (event.key === 'n' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        onNewNote()
        return
      }

      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        onFocusSearch()
        return
      }

      if (
        modalOpen &&
        event.key === 'p' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault()
        onTogglePin()
      }
    }

    document.addEventListener('keydown', handler)
    return (): void => document.removeEventListener('keydown', handler)
  }, [onNewNote, onFocusSearch, onCloseModal, onTogglePin, modalOpen])
}
