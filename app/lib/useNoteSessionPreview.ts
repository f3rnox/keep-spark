'use client'

import { useSyncExternalStore } from 'react'
import {
  getEncryptionSessionVersion,
  getSessionContent,
  isNoteUnlockedInSession,
  subscribeEncryptionSession,
} from './encryptionSessionStore'

/**
 * Result of `useNoteSessionPreview` for one note.
 */
export interface NoteSessionPreview {
  unlockedInSession: boolean
  previewContent: string | undefined
}

/**
 * Subscribes to unlock session state and decrypted preview content for a note.
 *
 * @param noteId Note identifier.
 */
export function useNoteSessionPreview(noteId: string): NoteSessionPreview {
  const version: number = useSyncExternalStore(
    subscribeEncryptionSession,
    getEncryptionSessionVersion,
    (): number => 0,
  )

  void version

  return {
    unlockedInSession: isNoteUnlockedInSession(noteId),
    previewContent: getSessionContent(noteId),
  }
}
