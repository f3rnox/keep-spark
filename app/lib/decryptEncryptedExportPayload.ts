import { base64ToBytes } from './base64ToBytes'
import { deriveKeyFromPassword } from './deriveKeyFromPassword'
import { decryptText } from './decryptText'
import type { EncryptedExportPayload } from './exportEncryptedAppData'
import type { AppExportPayload } from './exportAppData'

/**
 * Decrypts a password-protected backup envelope into the inner export payload.
 *
 * @param raw JSON string from an encrypted export file.
 * @param password Export password used when creating the backup.
 */
export async function decryptEncryptedExportPayload(
  raw: string,
  password: string,
): Promise<AppExportPayload> {
  const parsed: unknown = JSON.parse(raw)

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Backup file is not a valid JSON object.')
  }

  const record: Record<string, unknown> = parsed as Record<string, unknown>

  if (record.version !== 2) {
    throw new Error('Unsupported encrypted backup version.')
  }

  const kdf: unknown = record.kdf
  if (
    typeof kdf !== 'object' ||
    kdf === null ||
    typeof (kdf as EncryptedExportPayload['kdf']).salt !== 'string' ||
    typeof (kdf as EncryptedExportPayload['kdf']).iterations !== 'number'
  ) {
    throw new Error('Encrypted backup is missing key derivation metadata.')
  }

  if (typeof record.iv !== 'string' || typeof record.ciphertext !== 'string') {
    throw new Error('Encrypted backup is missing ciphertext.')
  }

  const envelope: EncryptedExportPayload = {
    version: 2,
    exportedAt: typeof record.exportedAt === 'number' ? record.exportedAt : Date.now(),
    kdf: kdf as EncryptedExportPayload['kdf'],
    iv: record.iv,
    ciphertext: record.ciphertext,
  }

  const key: CryptoKey = await deriveKeyFromPassword(
    password,
    base64ToBytes(envelope.kdf.salt),
    envelope.kdf.iterations,
  )

  let decrypted: string
  try {
    decrypted = await decryptText(envelope.ciphertext, envelope.iv, key)
  } catch {
    throw new Error('Incorrect export password or corrupted backup file.')
  }

  const inner: unknown = JSON.parse(decrypted)
  if (
    typeof inner !== 'object' ||
    inner === null ||
    (inner as AppExportPayload).version !== 1 ||
    !Array.isArray((inner as AppExportPayload).notes) ||
    !Array.isArray((inner as AppExportPayload).lists)
  ) {
    throw new Error('Decrypted backup payload is invalid.')
  }

  return inner as AppExportPayload
}
