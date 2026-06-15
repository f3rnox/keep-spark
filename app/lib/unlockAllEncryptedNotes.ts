import type { Note } from './types'
import { isNoteEncrypted } from './isNoteEncrypted'
import { isNoteUnlockedInSession } from './encryptionSessionStore'
import { unlockNoteSession } from './unlockNoteSession'
import { unlockGlobalEncryption } from './unlockGlobalEncryption'

/**
 * Result of unlocking every encrypted note with the master password.
 */
export interface UnlockAllEncryptedNotesResult {
  unlocked: number
  failed: number
}

/**
 * Unlocks the global session and decrypts every encrypted note in memory.
 *
 * @param notes Notes collection to unlock.
 * @param password Master encryption password.
 */
export async function unlockAllEncryptedNotes(
  notes: ReadonlyArray<Note>,
  password: string,
): Promise<UnlockAllEncryptedNotesResult> {
  const globalOk: boolean = await unlockGlobalEncryption(password)
  if (!globalOk) {
    throw new Error('Incorrect password')
  }

  let unlocked: number = 0
  let failed: number = 0

  for (const note of notes) {
    if (!isNoteEncrypted(note)) continue
    if (isNoteUnlockedInSession(note.id)) {
      unlocked += 1
      continue
    }

    try {
      await unlockNoteSession(note, password)
      unlocked += 1
    } catch {
      failed += 1
    }
  }

  return { unlocked, failed }
}
