import { bytesToBase64 } from './bytesToBase64'

/**
 * Encrypts a UTF-8 string with AES-GCM.
 *
 * @param plaintext Text to encrypt.
 * @param key Derived AES-GCM key.
 */
export async function encryptText(
  plaintext: string,
  key: CryptoKey,
): Promise<{ ciphertext: string, iv: string }> {
  const encoder: TextEncoder = new TextEncoder()
  const ivBuffer: ArrayBuffer = new ArrayBuffer(12)
  const iv: Uint8Array<ArrayBuffer> = new Uint8Array(ivBuffer)
  crypto.getRandomValues(iv)
  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext),
  )

  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv),
  }
}
