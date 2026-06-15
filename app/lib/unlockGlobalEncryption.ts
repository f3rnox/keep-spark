import {
  getMasterPasswordVerifierSnapshot,
  hasMasterPasswordSnapshot,
} from './masterPasswordStore'
import { unlockGlobalEncryptionSession } from './globalEncryptionSession'
import { verifyMasterPassword } from './verifyMasterPassword'

/**
 * Verifies and unlocks the global encryption session.
 *
 * @param password Master encryption password.
 */
export async function unlockGlobalEncryption(password: string): Promise<boolean> {
  if (!hasMasterPasswordSnapshot()) return false

  const verifier = getMasterPasswordVerifierSnapshot()
  if (verifier === null) return false

  const valid: boolean = await verifyMasterPassword(password, verifier)
  if (!valid) return false

  unlockGlobalEncryptionSession(password)
  return true
}
