import type { Note } from './types'
import { base64ToBytes } from './base64ToBytes'
import { deriveKeyFromPassword } from './deriveKeyFromPassword'
import {
  decryptNoteContentWithKey,
  type DecryptedNoteContent,
} from './decryptNoteContent'
import { setSessionKey } from './encryptionSessionStore'
import { isNoteEncrypted } from './isNoteEncrypted'
import { getEncryptionPassword } from './getEncryptionPassword'

/**
 * Fields returned after unlocking an encrypted note.
 */
export interface UnlockedNoteFields {
  title: string
  content: string
}

/**
 * Derives a session key from the password and decrypts an encrypted note body.
 *
 * @param note Encrypted note from storage.
 * @param password User-supplied password.
 */
export async function unlockNoteSession(
  note: Note,
  password?: string,
): Promise<UnlockedNoteFields> {
  if (!isNoteEncrypted(note) || note.cipher === null) {
    throw new Error('Note is not encrypted')
  }

  const resolvedPassword: string | null = password ?? getEncryptionPassword()
  if (resolvedPassword === null || resolvedPassword.length === 0) {
    throw new Error('Password required')
  }

  const salt: Uint8Array<ArrayBuffer> = base64ToBytes(note.cipher.salt)
  const key: CryptoKey = await deriveKeyFromPassword(
    resolvedPassword,
    salt,
    note.cipher.iterations,
  )

  try {
    const fields: DecryptedNoteContent = await decryptNoteContentWithKey(note, key)
    setSessionKey(note.id, key, fields.content)
    return { title: note.title, content: fields.content }
  } catch {
    throw new Error('Incorrect password')
  }
}
