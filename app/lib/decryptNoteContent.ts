import type { Note } from './types'
import { base64ToBytes } from './base64ToBytes'
import { deriveKeyFromPassword } from './deriveKeyFromPassword'
import { decryptText } from './decryptText'
import { isNoteEncrypted } from './isNoteEncrypted'

/**
 * Plaintext body recovered from an encrypted note.
 */
export interface DecryptedNoteContent {
  content: string
}

/**
 * Decrypts an encrypted note using a password.
 *
 * @param note Encrypted note from storage.
 * @param password Password used to derive the decryption key.
 */
export async function decryptNoteContent(
  note: Note,
  password: string,
): Promise<DecryptedNoteContent> {
  if (!isNoteEncrypted(note) || note.cipher === null) {
    throw new Error('Note is not encrypted')
  }

  const salt: Uint8Array<ArrayBuffer> = base64ToBytes(note.cipher.salt)
  const key: CryptoKey = await deriveKeyFromPassword(
    password,
    salt,
    note.cipher.iterations,
  )

  return decryptNoteContentWithKey(note, key)
}

/**
 * Parses legacy ciphertext that bundled title and body in one JSON payload.
 *
 * @param plaintext Decrypted legacy payload.
 * @param note Note whose stored title may supplement legacy data.
 */
function parseLegacyEncryptedPayload(plaintext: string): DecryptedNoteContent | null {
  try {
    const parsed: unknown = JSON.parse(plaintext)
    if (typeof parsed !== 'object' || parsed === null) return null

    const candidate = parsed as { title?: unknown, content?: unknown }
    if (typeof candidate.content !== 'string') return null

    return { content: candidate.content }
  } catch {
    return null
  }
}

/**
 * Decrypts an encrypted note body using a previously derived session key.
 *
 * @param note Encrypted note from storage.
 * @param key AES-GCM key for this note.
 */
export async function decryptNoteContentWithKey(
  note: Note,
  key: CryptoKey,
): Promise<DecryptedNoteContent> {
  if (!isNoteEncrypted(note) || note.cipher === null) {
    throw new Error('Note is not encrypted')
  }

  const plaintext: string = await decryptText(note.content, note.cipher.iv, key)
  const legacy: DecryptedNoteContent | null = parseLegacyEncryptedPayload(plaintext)
  if (legacy !== null) return legacy

  return { content: plaintext }
}
