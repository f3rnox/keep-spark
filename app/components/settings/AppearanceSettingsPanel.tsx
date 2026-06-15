'use client'

import type { JSX } from 'react'
import { THEME_DEFINITIONS, THEME_ORDER, type Theme } from '../../lib/theme'
import { useTheme } from '../../lib/useTheme'
import { SettingsSection } from './SettingsSection'

/**
 * Appearance settings for theme selection.
 */
export function AppearanceSettingsPanel(): JSX.Element {
  const { theme, setTheme } = useTheme()

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Color palettes'
        description='Choose how KeepSpark looks. Your choice is saved on this device.'
      >
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {THEME_ORDER.map((value: Theme): JSX.Element => {
            const option = THEME_DEFINITIONS[value]
            const active: boolean = theme === value

            return (
              <button
                key={value}
                type='button'
                onClick={(): void => setTheme(value)}
                aria-pressed={active}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? 'border-accent bg-surface-hover ring-2 ring-ring'
                    : 'border-border bg-surface hover:bg-surface-hover'
                }`}
              >
                <div className='mb-3 flex gap-1.5'>
                  {option.swatch.map(
                    (color: string): JSX.Element => (
                      <span
                        key={color}
                        aria-hidden='true'
                        className='h-8 flex-1 rounded-md border border-black/10'
                        style={{ backgroundColor: color }}
                      />
                    ),
                  )}
                </div>
                <p className='text-sm font-medium text-foreground'>{option.label}</p>
                <p className='mt-1 text-xs leading-relaxed text-muted'>{option.description}</p>
              </button>
            )
          })}
        </div>
      </SettingsSection>
    </div>
  )
}
