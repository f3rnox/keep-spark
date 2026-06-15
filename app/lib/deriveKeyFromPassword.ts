/**
 * Derives an AES-GCM key from a password using PBKDF2.
 *
 * @param password User-supplied password.
 * @param salt Random salt used for key derivation.
 * @param iterations PBKDF2 iteration count.
 * @param extractable Whether the derived key may be exported.
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
  extractable: boolean = false,
): Promise<CryptoKey> {
  const encoder: TextEncoder = new TextEncoder()
  const keyMaterial: CryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    extractable,
    ['encrypt', 'decrypt'],
  )
}
