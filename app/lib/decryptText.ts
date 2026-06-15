import { base64ToBytes } from './base64ToBytes'

/**
 * Decrypts an AES-GCM ciphertext back to a UTF-8 string.
 *
 * @param ciphertext Base64-encoded ciphertext.
 * @param iv Base64-encoded initialization vector.
 * @param key Derived AES-GCM key.
 */
export async function decryptText(
  ciphertext: string,
  iv: string,
  key: CryptoKey,
): Promise<string> {
  const decoder: TextDecoder = new TextDecoder()
  const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(iv) },
    key,
    base64ToBytes(ciphertext),
  )

  return decoder.decode(decrypted)
}
