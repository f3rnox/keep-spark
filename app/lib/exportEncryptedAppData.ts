import { bytesToBase64 } from './bytesToBase64'
import { deriveKeyFromPassword } from './deriveKeyFromPassword'
import { encryptText } from './encryptText'
import { ENCRYPTION_ITERATIONS } from './encryptionConstants'
import { exportAppData, type AppExportPayload } from './exportAppData'

/**
 * Password-protected backup envelope written to encrypted export files.
 */
export interface EncryptedExportPayload {
  version: 2
  exportedAt: number
  kdf: {
    salt: string
    iterations: number
  }
  iv: string
  ciphertext: string
}

/**
 * Builds a password-protected encrypted backup of all notes and lists.
 *
 * @param password Export password used to encrypt the backup blob.
 */
export async function exportEncryptedAppData(password: string): Promise<string> {
  const plainJson: string = await exportAppData()
  const payload: AppExportPayload = JSON.parse(plainJson) as AppExportPayload

  const saltBuffer: ArrayBuffer = new ArrayBuffer(16)
  const salt: Uint8Array<ArrayBuffer> = new Uint8Array(saltBuffer)
  crypto.getRandomValues(salt)

  const key: CryptoKey = await deriveKeyFromPassword(password, salt, ENCRYPTION_ITERATIONS)
  const encrypted = await encryptText(JSON.stringify(payload), key)

  const envelope: EncryptedExportPayload = {
    version: 2,
    exportedAt: Date.now(),
    kdf: {
      salt: bytesToBase64(salt),
      iterations: ENCRYPTION_ITERATIONS,
    },
    iv: encrypted.iv,
    ciphertext: encrypted.ciphertext,
  }

  return JSON.stringify(envelope, null, 2)
}
