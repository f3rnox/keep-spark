'use client'

import type { JSX } from 'react'
import type { Theme } from '../../lib/theme'
import { useTheme } from '../../lib/useTheme'
import { Icon } from '../Icon'
import { SettingsRow } from './SettingsRow'
import { SettingsSection } from './SettingsSection'

const THEME_OPTIONS: ReadonlyArray<{ value: Theme; label: string; icon: 'sun' | 'moon' }> = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
]

/**
 * Appearance settings for theme selection.
 */
export function AppearanceSettingsPanel(): JSX.Element {
  const { theme, setTheme } = useTheme()

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Theme'
        description='Choose how KeepSpark looks. Your choice is saved on this device.'
      >
        <SettingsRow
          label='Color scheme'
          description='Light uses warm neutrals; dark uses a near-black canvas.'
        >
          <div className='inline-flex rounded-lg border border-border bg-canvas p-1'>
            {THEME_OPTIONS.map((option): JSX.Element => {
              const active: boolean = theme === option.value
              return (
                <button
                  key={option.value}
                  type='button'
                  onClick={(): void => setTheme(option.value)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? 'bg-accent text-on-accent'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <Icon name={option.icon} size={16} />
                  {option.label}
                </button>
              )
            })}
          </div>
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
