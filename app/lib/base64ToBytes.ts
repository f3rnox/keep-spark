/**
 * Decodes a base64 string into raw bytes backed by an `ArrayBuffer`.
 *
 * @param value Base64-encoded string.
 */
export function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary: string = atob(value)
  const buffer: ArrayBuffer = new ArrayBuffer(binary.length)
  const bytes: Uint8Array<ArrayBuffer> = new Uint8Array(buffer)
  for (let index: number = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}
