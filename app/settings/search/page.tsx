import type { JSX } from 'react'
import { SearchSettingsPanel } from '../../components/settings/SearchSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * Search settings page for recent query history.
 */
export default function SearchSettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='Search'
      description='Manage recent searches saved on this device.'
    >
      <SearchSettingsPanel />
    </SettingsShell>
  )
}
