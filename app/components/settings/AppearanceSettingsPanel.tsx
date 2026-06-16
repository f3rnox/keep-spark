'use client'

import type { JSX } from 'react'
import {
  DARK_THEME_ORDER,
  LIGHT_THEME_ORDER,
  THEME_DEFINITIONS,
  type Theme,
} from '../../lib/theme'
import { useTheme } from '../../lib/useTheme'
import { SettingsSection } from './SettingsSection'

/**
 * Props for one selectable theme palette card.
 */
interface ThemePaletteButtonProps {
  value: Theme
  active: boolean
  onSelect: (theme: Theme) => void
}

/**
 * Renders a single theme preview card for the appearance settings grid.
 *
 * @param props.value Theme id for this card.
 * @param props.active Whether this palette is currently selected.
 * @param props.onSelect Invoked when the user picks this palette.
 */
function ThemePaletteButton({
  value,
  active,
  onSelect,
}: ThemePaletteButtonProps): JSX.Element {
  const option = THEME_DEFINITIONS[value]

  return (
    <button
      type='button'
      onClick={(): void => onSelect(value)}
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
}

/**
 * Appearance settings for theme selection.
 */
export function AppearanceSettingsPanel(): JSX.Element {
  const { lightTheme, darkTheme, setLightTheme, setDarkTheme } = useTheme()

  return (
    <div className='space-y-8'>
      <SettingsSection
        title='Light mode palette'
        description='Chosen when you switch to light mode from the header. Your choice is saved on this device.'
      >
        <div className='grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
          {LIGHT_THEME_ORDER.map(
            (value: Theme): JSX.Element => (
              <ThemePaletteButton
                key={value}
                value={value}
                active={lightTheme === value}
                onSelect={setLightTheme}
              />
            ),
          )}
        </div>
      </SettingsSection>

      <SettingsSection
        title='Dark mode palette'
        description='Chosen when you switch to dark mode from the header.'
      >
        <div className='grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
          {DARK_THEME_ORDER.map(
            (value: Theme): JSX.Element => (
              <ThemePaletteButton
                key={value}
                value={value}
                active={darkTheme === value}
                onSelect={setDarkTheme}
              />
            ),
          )}
        </div>
      </SettingsSection>
    </div>
  )
}
