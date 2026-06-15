'use client'

import { useCallback, useState, type FormEvent, type JSX } from 'react'
import { isSupabaseConfigured } from '../../lib/isSupabaseConfigured'
import { runSupabaseSync } from '../../lib/runSupabaseSync'
import {
  signInWithPassword,
  signOutSupabase,
  signUpWithPassword,
} from '../../lib/supabaseAuthStore'
import { useSupabaseAuth } from '../../lib/useSupabaseAuth'
import { useSupabaseSync } from '../../lib/useSupabaseSync'
import { Icon } from '../Icon'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

/**
 * Account and cloud sync settings backed by Supabase.
 */
export function SyncSettingsPanel(): JSX.Element {
  const { status, user } = useSupabaseAuth()
  const { status: syncStatus, lastSyncedAt, error: syncError } = useSupabaseSync()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [busy, setBusy] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const configured: boolean = isSupabaseConfigured()

  const handleSignIn = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await signInWithPassword(email.trim(), password)
      setMessage('Signed in. Syncing your notes…')
      setPassword('')
    } catch (signInError: unknown) {
      setError(signInError instanceof Error ? signInError.message : 'Sign in failed.')
    } finally {
      setBusy(false)
    }
  }, [email, password])

  const handleSignUp = useCallback(async (): Promise<void> => {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await signUpWithPassword(email.trim(), password)
      setMessage('Account created. Check your email if confirmation is required, then sign in.')
    } catch (signUpError: unknown) {
      setError(signUpError instanceof Error ? signUpError.message : 'Sign up failed.')
    } finally {
      setBusy(false)
    }
  }, [email, password])

  const handleSignOut = useCallback(async (): Promise<void> => {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await signOutSupabase()
      setMessage('Signed out.')
    } catch (signOutError: unknown) {
      setError(signOutError instanceof Error ? signOutError.message : 'Sign out failed.')
    } finally {
      setBusy(false)
    }
  }, [])

  const handleSyncNow = useCallback(async (): Promise<void> => {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await runSupabaseSync()
      setMessage('Sync complete.')
    } catch (syncNowError: unknown) {
      setError(syncNowError instanceof Error ? syncNowError.message : 'Sync failed.')
    } finally {
      setBusy(false)
    }
  }, [])

  if (!configured) {
    return (
      <SettingsSection
        title='Cloud sync'
        description='Supabase is not configured for this deployment.'
      >
        <p className='px-4 py-3 text-sm text-muted'>
          Add <code className='text-foreground'>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className='text-foreground'>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
          <code className='text-foreground'>.env.local</code>, then run the SQL in{' '}
          <code className='text-foreground'>supabase/schema.sql</code>.
        </p>
      </SettingsSection>
    )
  }

  const lastSyncedLabel: string =
    lastSyncedAt === null
      ? 'Never'
      : new Date(lastSyncedAt).toLocaleString()

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Account'
        description='Sign in to sync notes, lists, and preferences across devices.'
      >
        {status === 'signed-in' && user !== null ? (
          <>
            <SettingsRow label='Signed in as' description='Your Supabase account email.'>
              <span className='max-w-[12rem] truncate text-sm text-muted'>{user.email}</span>
            </SettingsRow>
            <SettingsRow label='Sign out' description='Stop syncing on this device.'>
              <button
                type='button'
                disabled={busy}
                onClick={(): void => {
                  void handleSignOut()
                }}
                className='inline-flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50'
              >
                <Icon name='lockOpen' size={16} />
                Sign out
              </button>
            </SettingsRow>
          </>
        ) : (
          <form onSubmit={(event: FormEvent<HTMLFormElement>): void => { void handleSignIn(event) }} className='space-y-4 px-4 py-3'>
            <div className='space-y-2'>
              <label htmlFor='sync-email' className='text-sm font-medium text-foreground'>
                Email
              </label>
              <input
                id='sync-email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(event): void => setEmail(event.target.value)}
                className='w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40'
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='sync-password' className='text-sm font-medium text-foreground'>
                Password
              </label>
              <input
                id='sync-password'
                type='password'
                autoComplete='current-password'
                required
                minLength={8}
                value={password}
                onChange={(event): void => setPassword(event.target.value)}
                className='w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40'
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <button
                type='submit'
                disabled={busy || status === 'loading'}
                className='inline-flex items-center gap-2 rounded-lg border border-border bg-foreground px-3 py-2 text-sm text-canvas transition-opacity hover:opacity-90 disabled:opacity-50'
              >
                <Icon name='lock' size={16} />
                Sign in
              </button>
              <button
                type='button'
                disabled={busy || status === 'loading'}
                onClick={(): void => {
                  void handleSignUp()
                }}
                className='inline-flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50'
              >
                Create account
              </button>
            </div>
          </form>
        )}
      </SettingsSection>

      {status === 'signed-in' ? (
        <SettingsSection
          title='Sync status'
          description='Notes and lists merge by latest update. Preferences sync theme, layout, sort, and shortcuts.'
        >
          <SettingsRow label='Status' description='Background sync runs every minute while signed in.'>
            <span className='text-sm capitalize text-muted'>
              {syncStatus === 'syncing' ? 'Syncing…' : syncStatus}
            </span>
          </SettingsRow>
          <SettingsRow label='Last synced' description='Most recent successful sync on this device.'>
            <span className='text-sm text-muted'>{lastSyncedLabel}</span>
          </SettingsRow>
          <SettingsRow label='Sync now' description='Pull remote changes, merge, and push local data.'>
            <button
              type='button'
              disabled={busy || syncStatus === 'syncing'}
              onClick={(): void => {
                void handleSyncNow()
              }}
              className='inline-flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50'
            >
              <Icon name='upload' size={16} />
              Sync now
            </button>
          </SettingsRow>
        </SettingsSection>
      ) : null}

      {message ? <p className='text-sm text-foreground'>{message}</p> : null}
      {error ?? syncError ? (
        <p className='text-sm text-red-600 dark:text-red-400'>{error ?? syncError}</p>
      ) : null}
    </div>
  )
}
