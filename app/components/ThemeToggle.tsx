'use client'

import type { JSX } from 'react'
import { THEME_DEFINITIONS } from '../lib/theme'
import { useTheme } from '../lib/useTheme'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/**
 * Header control that switches between the configured light and dark palettes.
 */
export function ThemeToggle(): JSX.Element {
  const { theme, lightTheme, darkTheme, toggleTheme } = useTheme()
  const definition = THEME_DEFINITIONS[theme]
  const target = definition.isDark
    ? THEME_DEFINITIONS[lightTheme].label
    : THEME_DEFINITIONS[darkTheme].label

  return (
    <IconButton
      label={`${definition.label} theme active. Switch to ${target}.`}
      onClick={toggleTheme}
    >
      <Icon name={definition.isDark ? 'moon' : 'sun'} size={18} />
    </IconButton>
  )
}
