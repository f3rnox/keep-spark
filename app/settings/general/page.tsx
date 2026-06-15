import type { JSX } from 'react'
import { GeneralSettingsPanel } from '../../components/settings/GeneralSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * General settings page for default browsing behavior.
 */
export default function GeneralSettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='General'
      description='Default sort order and note layout preferences.'
    >
      <GeneralSettingsPanel />
    </SettingsShell>
  )
}
