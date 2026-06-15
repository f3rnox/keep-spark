import { base64ToBytes } from './base64ToBytes'
import { bytesToBase64 } from './bytesToBase64'
import { deriveKeyFromPassword } from './deriveKeyFromPassword'
import type { MasterPasswordVerifier } from './masterPasswordVerifier'

/**
 * Returns whether a password matches the stored master password verifier.
 *
 * @param password Password to verify.
 * @param verifier Stored verifier metadata.
 */
export async function verifyMasterPassword(
  password: string,
  verifier: MasterPasswordVerifier,
): Promise<boolean> {
  const salt: Uint8Array<ArrayBuffer> = base64ToBytes(verifier.salt)
  const key: CryptoKey = await deriveKeyFromPassword(
    password,
    salt,
    verifier.iterations,
    true,
  )
  const raw: ArrayBuffer = await crypto.subtle.exportKey('raw', key)

  return bytesToBase64(new Uint8Array(raw)) === verifier.hash
}
