import type { JSX } from 'react'
import { EncryptionSettingsPanel } from '../../components/settings/EncryptionSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * Encryption settings page for the master note password.
 */
export default function SecuritySettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='Encryption'
      description='Configure the master password used for all locked notes.'
    >
      <EncryptionSettingsPanel />
    </SettingsShell>
  )
}
