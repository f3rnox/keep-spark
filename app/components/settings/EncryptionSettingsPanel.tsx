'use client'

import { useState, type FormEvent, type JSX } from 'react'
import Link from 'next/link'
import { useMasterPassword } from '../../lib/useMasterPassword'
import { usePasskeyUnlock } from '../../lib/usePasskeyUnlock'
import { useAutoLockPreference } from '../../lib/useAutoLockPreference'
import { isPasskeyUnlockAvailable } from '../../lib/isPasskeyUnlockAvailable'
import type { AutoLockMinutes } from '../../lib/autoLockStore'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

const AUTO_LOCK_OPTIONS: ReadonlyArray<{ value: AutoLockMinutes, label: string }> = [
  { value: 0, label: 'Never' },
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
]

/**
 * Settings panel for configuring the master encryption password.
 */
export function EncryptionSettingsPanel(): JSX.Element {
  const { hasMasterPassword, setMasterPassword, changeMasterPassword, clearMasterPassword } =
    useMasterPassword()
  const { hasPasskey, registerPasskey, clearPasskey } = usePasskeyUnlock()
  const { minutes: autoLockMinutes, setMinutes: setAutoLockMinutes } = useAutoLockPreference()

  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [passkeyPassword, setPasskeyPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<boolean>(false)

  const passkeyAvailable: boolean = isPasskeyUnlockAvailable()

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError(null)

    if (password.length === 0) {
      setError('Enter a password')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setBusy(true)
    try {
      await setMasterPassword(password)
      setPassword('')
      setConfirmPassword('')
    } catch {
      setError('Could not save encryption password')
    } finally {
      setBusy(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError(null)
    if (currentPassword.length === 0 || password.length === 0) {
      setError('Enter the current and new passwords')
      return
    }
    if (password !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setBusy(true)
    try {
      await changeMasterPassword(currentPassword, password)
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
    } catch {
      setError('Incorrect current password')
    } finally {
      setBusy(false)
    }
  }

  const handleClearPassword = async (): Promise<void> => {
    setError(null)
    if (currentPassword.length === 0) {
      setError('Enter the current password to remove encryption')
      return
    }

    setBusy(true)
    try {
      await clearMasterPassword(currentPassword)
      clearPasskey()
      setCurrentPassword('')
    } catch {
      setError('Incorrect password')
    } finally {
      setBusy(false)
    }
  }

  const handleRegisterPasskey = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError(null)
    if (passkeyPassword.length === 0) {
      setError('Enter your encryption password to register a passkey')
      return
    }

    setBusy(true)
    try {
      await registerPasskey(passkeyPassword)
      setPasskeyPassword('')
    } catch (passkeyError: unknown) {
      setError(passkeyError instanceof Error ? passkeyError.message : 'Could not register passkey')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Note encryption'
        description='Set one password for all locked notes. Use the lock button in the top bar to unlock every encrypted note at once.'
      >
        <SettingsRow
          label='Status'
          description={
            hasMasterPassword
              ? 'A master encryption password is configured.'
              : 'No encryption password is configured yet.'
          }
        >
          <span className='text-sm text-muted'>
            {hasMasterPassword ? 'Configured' : 'Not configured'}
          </span>
        </SettingsRow>

        <div className='space-y-4 px-4 py-4'>
          {!hasMasterPassword ? (
            <form onSubmit={handleSetPassword} className='space-y-4'>
              <label className='block'>
                <span className='mb-1 block text-sm font-medium text-foreground'>Password</span>
                <input
                  type='password'
                  value={password}
                  onChange={(event): void => setPassword(event.target.value)}
                  autoComplete='new-password'
                  className='w-full max-w-md rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </label>
              <label className='block'>
                <span className='mb-1 block text-sm font-medium text-foreground'>Confirm password</span>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(event): void => setConfirmPassword(event.target.value)}
                  autoComplete='new-password'
                  className='w-full max-w-md rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </label>
              <button
                type='submit'
                disabled={busy}
                className='rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition hover:opacity-90 disabled:opacity-50'
              >
                {busy ? 'Saving…' : 'Set encryption password'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className='space-y-4'>
              <label className='block'>
                <span className='mb-1 block text-sm font-medium text-foreground'>Current password</span>
                <input
                  type='password'
                  value={currentPassword}
                  onChange={(event): void => setCurrentPassword(event.target.value)}
                  autoComplete='current-password'
                  className='w-full max-w-md rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </label>
              <label className='block'>
                <span className='mb-1 block text-sm font-medium text-foreground'>New password</span>
                <input
                  type='password'
                  value={password}
                  onChange={(event): void => setPassword(event.target.value)}
                  autoComplete='new-password'
                  className='w-full max-w-md rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </label>
              <label className='block'>
                <span className='mb-1 block text-sm font-medium text-foreground'>Confirm new password</span>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(event): void => setConfirmPassword(event.target.value)}
                  autoComplete='new-password'
                  className='w-full max-w-md rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </label>
              <div className='flex flex-wrap gap-2'>
                <button
                  type='submit'
                  disabled={busy}
                  className='rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition hover:opacity-90 disabled:opacity-50'
                >
                  {busy ? 'Saving…' : 'Change password'}
                </button>
                <button
                  type='button'
                  disabled={busy}
                  onClick={(): void => {
                    void handleClearPassword()
                  }}
                  className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-50'
                >
                  Remove password
                </button>
              </div>
            </form>
          )}

          {error ? <p className='text-sm text-red-600 dark:text-red-400'>{error}</p> : null}

          {!hasMasterPassword ? (
            <p className='text-sm text-muted'>
              After setting a password, use the lock icon in the{' '}
              <Link href='/' className='text-foreground underline underline-offset-2'>
                top bar
              </Link>{' '}
              to unlock all encrypted notes.
            </p>
          ) : null}
        </div>
      </SettingsSection>

      {hasMasterPassword ? (
        <SettingsSection
          title='Passkey unlock'
          description='Use your device passkey to unlock encryption instead of typing your password each session.'
        >
          <SettingsRow
            label='Passkey status'
            description={
              passkeyAvailable
                ? hasPasskey
                  ? 'A passkey is registered for encryption unlock.'
                  : 'Register a platform passkey to unlock faster.'
                : 'Passkey unlock requires a secure context and a platform authenticator with PRF support.'
            }
          >
            <span className='text-sm text-muted'>
              {hasPasskey ? 'Registered' : passkeyAvailable ? 'Not registered' : 'Unavailable'}
            </span>
          </SettingsRow>

          {passkeyAvailable && !hasPasskey ? (
            <form onSubmit={handleRegisterPasskey} className='space-y-4 px-4 py-4'>
              <label className='block'>
                <span className='mb-1 block text-sm font-medium text-foreground'>Encryption password</span>
                <input
                  type='password'
                  value={passkeyPassword}
                  onChange={(event): void => setPasskeyPassword(event.target.value)}
                  autoComplete='current-password'
                  className='w-full max-w-md rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </label>
              <button
                type='submit'
                disabled={busy}
                className='rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition hover:opacity-90 disabled:opacity-50'
              >
                {busy ? 'Registering…' : 'Register passkey'}
              </button>
            </form>
          ) : null}

          {hasPasskey ? (
            <div className='px-4 py-4'>
              <button
                type='button'
                disabled={busy}
                onClick={(): void => clearPasskey()}
                className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-50'
              >
                Remove passkey
              </button>
            </div>
          ) : null}
        </SettingsSection>
      ) : null}

      {hasMasterPassword ? (
        <SettingsSection
          title='Auto-lock'
          description='Automatically lock encryption sessions after a period of inactivity.'
        >
          <SettingsRow
            label='Idle timeout'
            description='Locks global and per-note encryption sessions when you stop interacting with the app.'
          >
            <select
              value={autoLockMinutes}
              onChange={(event): void => setAutoLockMinutes(Number.parseInt(event.target.value, 10) as AutoLockMinutes)}
              className='rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              {AUTO_LOCK_OPTIONS.map((option): JSX.Element => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingsRow>
        </SettingsSection>
      ) : null}
    </div>
  )
}
