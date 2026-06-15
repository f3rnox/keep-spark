import { bytesToBase64 } from './bytesToBase64'
import { deriveKeyFromPassword } from './deriveKeyFromPassword'
import { ENCRYPTION_ITERATIONS } from './encryptionConstants'
import type { MasterPasswordVerifier } from './masterPasswordVerifier'

/**
 * Derives a verifier record from a master encryption password.
 *
 * @param password Master password to hash.
 */
export async function hashMasterPasswordVerifier(
  password: string,
): Promise<MasterPasswordVerifier> {
  const saltBuffer: ArrayBuffer = new ArrayBuffer(16)
  const salt: Uint8Array<ArrayBuffer> = new Uint8Array(saltBuffer)
  crypto.getRandomValues(salt)
  const key: CryptoKey = await deriveKeyFromPassword(password, salt, ENCRYPTION_ITERATIONS, true)
  const raw: ArrayBuffer = await crypto.subtle.exportKey('raw', key)

  return {
    salt: bytesToBase64(salt),
    hash: bytesToBase64(new Uint8Array(raw)),
    iterations: ENCRYPTION_ITERATIONS,
  }
}
