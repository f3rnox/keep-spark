/**
 * Encodes raw bytes as a base64 string.
 *
 * @param bytes Bytes to encode.
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary: string = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}
