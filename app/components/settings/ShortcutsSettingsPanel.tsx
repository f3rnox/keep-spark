import type { JSX } from 'react'
import { KeyboardShortcutsList } from '../KeyboardShortcutsList'
import { SettingsSection } from './SettingsSection'

/**
 * Reference list of keyboard shortcuts.
 */
export function ShortcutsSettingsPanel(): JSX.Element {
  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Shortcuts'
        description='Available when focus is not inside a text field, unless noted otherwise.'
      >
        <KeyboardShortcutsList />
      </SettingsSection>
    </div>
  )
}
