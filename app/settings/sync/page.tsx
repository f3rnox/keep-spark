import type { JSX } from 'react'
import { SyncSettingsPanel } from '../../components/settings/SyncSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * Cloud sync settings page for Supabase account and manual sync.
 */
export default function SyncSettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='Cloud sync'
      description='Sign in to sync notes, lists, and preferences across devices.'
    >
      <SyncSettingsPanel />
    </SettingsShell>
  )
}
