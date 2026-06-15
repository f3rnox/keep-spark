import type { JSX } from 'react'
import { ShortcutsSettingsPanel } from '../../components/settings/ShortcutsSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * Keyboard shortcuts reference page.
 */
export default function ShortcutsSettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='Keyboard shortcuts'
      description='Quick actions available throughout KeepSpark.'
    >
      <ShortcutsSettingsPanel />
    </SettingsShell>
  )
}
