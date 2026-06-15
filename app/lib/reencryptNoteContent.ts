import type { Note } from './types'
import { encryptText } from './encryptText'
import type { EncryptedNoteFields } from './encryptNoteContent'
import { encryptNoteContent } from './encryptNoteContent'

/**
 * Re-encrypts a note body with an existing session key, preserving salt metadata.
 *
 * @param title Plaintext title stored unencrypted.
 * @param content Plaintext body to encrypt.
 * @param note Existing encrypted note whose cipher metadata should be reused.
 * @param key Session AES-GCM key for the note.
 */
export async function reencryptNoteContent(
  title: string,
  content: string,
  note: Note,
  key: CryptoKey,
): Promise<EncryptedNoteFields> {
  if (note.cipher === null) {
    throw new Error('Note cipher metadata is missing')
  }

  const { ciphertext, iv }: { ciphertext: string, iv: string } = await encryptText(content, key)

  return {
    title,
    content: ciphertext,
    encrypted: true,
    cipher: {
      iv,
      salt: note.cipher.salt,
      iterations: note.cipher.iterations,
    },
  }
}

/**
 * Re-encrypts a note body with a new password, rotating salt and IV.
 *
 * @param title Plaintext title stored unencrypted.
 * @param content Plaintext body to encrypt.
 * @param password New password for the note.
 */
export async function reencryptNoteContentWithPassword(
  title: string,
  content: string,
  password: string,
): Promise<EncryptedNoteFields> {
  return encryptNoteContent(title, content, password)
}
