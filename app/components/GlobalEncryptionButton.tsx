'use client'

import { useState, type JSX } from 'react'
import { useGlobalEncryption } from '../lib/useGlobalEncryption'
import { useNotes } from '../lib/useNotes'
import { usePasskeyUnlock } from '../lib/usePasskeyUnlock'
import { isPasskeyUnlockAvailable } from '../lib/isPasskeyUnlockAvailable'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { IconLink } from './IconLink'
import { PasswordPromptModal } from './PasswordPromptModal'

/**
 * Top-bar control for locking and unlocking all encrypted notes.
 */
export function GlobalEncryptionButton(): JSX.Element {
  const { notes } = useNotes()
  const { hasMasterPassword, isUnlocked, encryptedCount, unlockAll, lockAll } =
    useGlobalEncryption(notes)
  const { hasPasskey, unlockWithPasskey } = usePasskeyUnlock()
  const [promptOpen, setPromptOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<boolean>(false)

  const passkeyAvailable: boolean = isPasskeyUnlockAvailable() && hasPasskey

  if (!hasMasterPassword) {
    return (
      <IconLink href='/settings/security' label='Configure encryption password'>
        <Icon name='lock' size={18} />
      </IconLink>
    )
  }

  const handleClick = (): void => {
    if (isUnlocked) {
      lockAll()
      return
    }
    setError(null)
    setPromptOpen(true)
  }

  const handleUnlock = async (password: string): Promise<void> => {
    setBusy(true)
    setError(null)
    try {
      await unlockAll(password)
      setPromptOpen(false)
    } catch {
      setError('Incorrect password')
    } finally {
      setBusy(false)
    }
  }

  const handlePasskeyUnlock = async (): Promise<void> => {
    setBusy(true)
    setError(null)
    try {
      const password: string = await unlockWithPasskey()
      await unlockAll(password)
      setPromptOpen(false)
    } catch (passkeyError: unknown) {
      setError(passkeyError instanceof Error ? passkeyError.message : 'Passkey unlock failed')
    } finally {
      setBusy(false)
    }
  }

  const label: string = isUnlocked
    ? `Lock all notes (${encryptedCount} encrypted)`
    : `Unlock all notes (${encryptedCount} encrypted)`

  return (
    <>
      <IconButton
        label={label}
        active={isUnlocked}
        onClick={handleClick}
        disabled={encryptedCount === 0 && !isUnlocked}
      >
        <Icon name={isUnlocked ? 'lockOpen' : 'lock'} size={18} />
      </IconButton>

      {promptOpen ? (
        <PasswordPromptModal
          title='Unlock all notes'
          description='Enter your encryption password to unlock every locked note.'
          confirmLabel='Unlock all'
          error={error}
          busy={busy}
          onSubmit={handleUnlock}
          onCancel={(): void => {
            setPromptOpen(false)
            setError(null)
          }}
          onPasskeyUnlock={passkeyAvailable ? handlePasskeyUnlock : undefined}
        />
      ) : null}
    </>
  )
}
