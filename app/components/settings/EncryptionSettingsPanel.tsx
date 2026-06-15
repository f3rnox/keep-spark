'use client'

import { useState, type FormEvent, type JSX } from 'react'
import Link from 'next/link'
import { useMasterPassword } from '../../lib/useMasterPassword'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

/**
 * Settings panel for configuring the master encryption password.
 */
export function EncryptionSettingsPanel(): JSX.Element {
  const { hasMasterPassword, setMasterPassword, changeMasterPassword, clearMasterPassword } =
    useMasterPassword()

  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<boolean>(false)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

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
      setSuccess('Encryption password saved. Locked notes can be unlocked from the toolbar.')
    } catch {
      setError('Could not save encryption password')
    } finally {
      setBusy(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

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
      setSuccess('Encryption password updated.')
    } catch {
      setError('Incorrect current password')
    } finally {
      setBusy(false)
    }
  }

  const handleClearPassword = async (): Promise<void> => {
    setError(null)
    setSuccess(null)

    if (currentPassword.length === 0) {
      setError('Enter the current password to remove encryption')
      return
    }

    setBusy(true)
    try {
      await clearMasterPassword(currentPassword)
      setCurrentPassword('')
      setSuccess('Encryption password removed.')
    } catch {
      setError('Incorrect password')
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
          {success ? <p className='text-sm text-foreground'>{success}</p> : null}

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
    </div>
  )
}
