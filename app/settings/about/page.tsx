import type { JSX } from 'react'
import { AboutSettingsPanel } from '../../components/settings/AboutSettingsPanel'
import { SettingsShell } from '../../components/settings/SettingsShell'

/**
 * About page with app information.
 */
export default function AboutSettingsPage(): JSX.Element {
  return (
    <SettingsShell
      title='About'
      description='Version details and how KeepSpark stores your notes.'
    >
      <AboutSettingsPanel />
    </SettingsShell>
  )
}
