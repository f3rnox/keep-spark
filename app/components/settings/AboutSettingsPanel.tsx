import type { JSX } from 'react'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

/**
 * About page content with app metadata.
 */
export function AboutSettingsPanel(): JSX.Element {
  return (
    <div className='space-y-8'>
      <SettingsSection title='KeepSpark' description='A minimalist note-taking web UI inspired by Google Keep.'>
        <SettingsRow label='Version' description='Installed package version from this build.'>
          <span className='text-sm text-muted'>0.1.0</span>
        </SettingsRow>
        <SettingsRow label='Storage' description='Where your data lives on this device.'>
          <span className='text-sm text-muted'>IndexedDB + localStorage</span>
        </SettingsRow>
        <SettingsRow label='Offline' description='Works without a network connection after the first load.'>
          <span className='text-sm text-muted'>Supported</span>
        </SettingsRow>
      </SettingsSection>

      <p className='text-sm leading-relaxed text-muted'>
        KeepSpark stores everything locally in your browser. Export regularly if you want a backup,
        or before clearing site data. No account is required and nothing is sent to a server.
      </p>
    </div>
  )
}
