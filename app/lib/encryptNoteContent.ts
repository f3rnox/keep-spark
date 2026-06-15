import type { NoteCipher } from './types'
import { bytesToBase64 } from './bytesToBase64'
import { deriveKeyFromPassword } from './deriveKeyFromPassword'
import { encryptText } from './encryptText'
import { ENCRYPTION_ITERATIONS } from './encryptionConstants'

/**
 * Fields produced when encrypting a note body.
 */
export interface EncryptedNoteFields {
  title: string
  content: string
  encrypted: true
  cipher: NoteCipher
}

/**
 * Encrypts a note body with a user password. The title is stored in plaintext.
 *
 * @param title Plaintext title stored unencrypted.
 * @param content Plaintext body to encrypt.
 * @param password Password used to derive the encryption key.
 */
export async function encryptNoteContent(
  title: string,
  content: string,
  password: string,
): Promise<EncryptedNoteFields> {
  const saltBuffer: ArrayBuffer = new ArrayBuffer(16)
  const salt: Uint8Array<ArrayBuffer> = new Uint8Array(saltBuffer)
  crypto.getRandomValues(salt)
  const key: CryptoKey = await deriveKeyFromPassword(password, salt, ENCRYPTION_ITERATIONS)
  const { ciphertext, iv }: { ciphertext: string, iv: string } = await encryptText(content, key)

  return {
    title,
    content: ciphertext,
    encrypted: true,
    cipher: {
      iv,
      salt: bytesToBase64(salt),
      iterations: ENCRYPTION_ITERATIONS,
    },
  }
}
