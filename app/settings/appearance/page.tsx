import type { JSX } from 'react'
import { AppearanceSettingsPanel } from '../../components/settings/AppearanceSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * Appearance settings page for theme selection.
 */
export default function AppearanceSettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='Appearance'
      description='Theme and visual preferences for KeepSpark.'
    >
      <AppearanceSettingsPanel />
    </SettingsShell>
  )
}
