'use client'

import type { JSX } from 'react'
import { THEME_DEFINITIONS } from '../lib/theme'
import { useTheme } from '../lib/useTheme'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/**
 * Header control that cycles through the available color palettes.
 */
export function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme()
  const definition = THEME_DEFINITIONS[theme]

  return (
    <IconButton
      label={`Theme: ${definition.label}. Tap to switch palette.`}
      onClick={toggleTheme}
    >
      <Icon name={definition.isDark ? 'moon' : 'sun'} size={18} />
    </IconButton>
  )
}
