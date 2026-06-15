'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { JSX } from 'react'
import { isSupabaseConfigured } from '../lib/isSupabaseConfigured'
import { useSupabaseAuth } from '../lib/useSupabaseAuth'
import { Icon } from './Icon'

/**
 * Top-bar control linking to cloud sync sign-in or account status.
 */
export function HeaderSignInButton(): JSX.Element | null {
  const pathname: string = usePathname()
  const { status, user } = useSupabaseAuth()
  const configured: boolean = isSupabaseConfigured()
  const syncActive: boolean = pathname.startsWith('/settings/sync')

  if (!configured || status === 'loading') return null

  const baseClass: string =
    'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  if (status === 'signed-in' && user !== null) {
    return (
      <Link
        href='/settings/sync'
        aria-label='Cloud sync account'
        title={user.email ?? 'Cloud sync account'}
        className={`${baseClass} max-w-40 ${syncActive ? 'bg-surface-hover text-foreground' : ''}`.trim()}
      >
        <Icon name='upload' size={18} className='shrink-0' />
        <span className='hidden truncate sm:inline'>{user.email}</span>
      </Link>
    )
  }

  return (
    <Link
      href='/settings/sync'
      aria-label='Sign in to sync'
      className={`${baseClass} border border-border bg-canvas text-foreground hover:bg-surface-hover ${syncActive ? 'bg-surface-hover' : ''}`.trim()}
    >
      <Icon name='lock' size={16} className='shrink-0' />
      <span className='hidden sm:inline'>Sign in</span>
    </Link>
  )
}
