import type { JSX } from 'react'
import { DataSettingsPanel } from '../../components/settings/DataSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * Data and storage settings page for backup and reset.
 */
export default function DataSettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='Data & storage'
      description='Export, import, and reset local KeepSpark data.'
    >
      <DataSettingsPanel />
    </SettingsShell>
  )
}
