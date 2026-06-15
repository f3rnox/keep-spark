import type { NoteCipher } from './types'

/**
 * Coerces unknown cipher metadata into a valid `NoteCipher` or returns null.
 *
 * @param value Raw cipher object from storage.
 */
export function coerceNoteCipher(value: unknown): NoteCipher | null {
  if (typeof value !== 'object' || value === null) return null

  const candidate = value as Partial<NoteCipher>
  if (
    typeof candidate.iv !== 'string' ||
    typeof candidate.salt !== 'string' ||
    typeof candidate.iterations !== 'number'
  ) {
    return null
  }

  return {
    iv: candidate.iv,
    salt: candidate.salt,
    iterations: candidate.iterations,
  }
}
