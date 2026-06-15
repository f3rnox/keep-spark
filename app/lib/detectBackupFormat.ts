import type { AppExportPayload } from './exportAppData'
import { isGoogleKeepJsonNote } from './parseGoogleKeepJson'

/**
 * Detected backup or import file format.
 */
export type BackupFormat = 'keepspark-v1' | 'keepspark-v2-encrypted' | 'google-keep-json'

/**
 * Inspects parsed JSON to determine how it should be imported.
 *
 * @param parsed Parsed JSON root value.
 */
export function detectBackupFormat(parsed: unknown): BackupFormat | null {
  if (typeof parsed !== 'object' || parsed === null) return null
  const record: Record<string, unknown> = parsed as Record<string, unknown>

  if (record.version === 1 && Array.isArray(record.notes) && Array.isArray(record.lists)) {
    return 'keepspark-v1'
  }

  if (record.version === 2 && typeof record.ciphertext === 'string' && typeof record.iv === 'string') {
    return 'keepspark-v2-encrypted'
  }

  if (isGoogleKeepJsonNote(parsed)) {
    return 'google-keep-json'
  }

  return null
}

/**
 * Parses a JSON backup string and returns its detected format.
 *
 * @param raw Raw file contents.
 */
export function detectBackupFormatFromRaw(raw: string): BackupFormat | null {
  const trimmed: string = raw.trim()
  if (!trimmed.startsWith('{')) return null
  try {
    return detectBackupFormat(JSON.parse(trimmed) as unknown)
  } catch {
    return null
  }
}

/**
 * Coerces a decrypted or plain export payload into the canonical shape.
 *
 * @param payload Parsed inner backup payload.
 */
export function coerceAppExportPayload(payload: unknown): AppExportPayload {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Backup file is not a valid JSON object.')
  }

  const record: Record<string, unknown> = payload as Record<string, unknown>
  if (record.version !== 1 || !Array.isArray(record.notes) || !Array.isArray(record.lists)) {
    throw new Error('Backup file is missing notes or lists.')
  }

  return {
    version: 1,
    exportedAt: typeof record.exportedAt === 'number' ? record.exportedAt : Date.now(),
    notes: record.notes as AppExportPayload['notes'],
    lists: record.lists as AppExportPayload['lists'],
  }
}
