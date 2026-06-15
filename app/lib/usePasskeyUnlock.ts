'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { clearPasskeyUnlockRecord, hasPasskeyUnlockSnapshot, subscribePasskeyUnlock, getPasskeyUnlockServerSnapshot } from './passkeyUnlockStore'
import { getMasterPasswordVerifierSnapshot } from './masterPasswordStore'
import { registerPasskeyUnlock } from './registerPasskeyUnlock'
import { unlockWithPasskey } from './unlockWithPasskey'
import { verifyMasterPassword } from './verifyMasterPassword'

/**
 * API exposed by the `usePasskeyUnlock` hook.
 */
export interface PasskeyUnlockApi {
  hasPasskey: boolean
  registerPasskey: (password: string) => Promise<void>
  unlockWithPasskey: () => Promise<string>
  clearPasskey: () => void
}

/**
 * Subscribes to passkey-based encryption unlock state.
 */
export function usePasskeyUnlock(): PasskeyUnlockApi {
  const hasPasskey: boolean = useSyncExternalStore(
    subscribePasskeyUnlock,
    hasPasskeyUnlockSnapshot,
    (): boolean => getPasskeyUnlockServerSnapshot() !== null,
  )

  const registerPasskey = useCallback(async (password: string): Promise<void> => {
    const verifier = getMasterPasswordVerifierSnapshot()
    if (verifier === null) {
      throw new Error('No master password configured')
    }

    const valid: boolean = await verifyMasterPassword(password, verifier)
    if (!valid) {
      throw new Error('Incorrect password')
    }

    await registerPasskeyUnlock(password)
  }, [])

  const unlock = useCallback(async (): Promise<string> => {
    return unlockWithPasskey()
  }, [])

  const clearPasskey = useCallback((): void => {
    clearPasskeyUnlockRecord()
  }, [])

  return {
    hasPasskey,
    registerPasskey,
    unlockWithPasskey: unlock,
    clearPasskey,
  }
}
