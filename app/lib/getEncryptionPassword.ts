import {
  getGlobalEncryptionPassword,
  isGlobalEncryptionUnlocked,
} from './globalEncryptionSession'

/**
 * Returns the active encryption password from the global session, if unlocked.
 */
export function getEncryptionPassword(): string | null {
  if (!isGlobalEncryptionUnlocked()) return null
  return getGlobalEncryptionPassword()
}
