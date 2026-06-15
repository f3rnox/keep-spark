import { getEncryptionSessionVersion, hasAnySessionKeys } from './encryptionSessionStore'
import { isGlobalEncryptionUnlocked } from './globalEncryptionSession'

/**
 * Returns whether any encryption session is currently active.
 */
export function hasActiveEncryptionSessions(): boolean {
  void getEncryptionSessionVersion()
  return isGlobalEncryptionUnlocked() || hasAnySessionKeys()
}
