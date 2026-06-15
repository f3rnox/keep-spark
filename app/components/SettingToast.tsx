'use client'

import type { JSX } from 'react'
import { useIsClient } from '../lib/useIsClient'
import { useSettingToast } from '../lib/useSettingToast'
import { Icon } from './Icon'

/**
 * Renders the setting-saved toast after the client has mounted.
 */
function SettingToastContent(): JSX.Element | null {
  const { message, visible } = useSettingToast()

  if (!visible) return null

  return (
    <div
      role='status'
      aria-live='polite'
      className='safe-bottom pointer-events-none fixed bottom-4 left-1/2 z-[60] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2'
    >
      <div className='flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-lg shadow-black/10'>
        <span className='text-muted' aria-hidden='true'>
          <Icon name='check' size={16} />
        </span>
        <span>{message}</span>
      </div>
    </div>
  )
}

/**
 * Brief confirmation toast shown when a setting is saved.
 */
export function SettingToast(): JSX.Element | null {
  const isClient: boolean = useIsClient()

  if (!isClient) return null

  return <SettingToastContent />
}
