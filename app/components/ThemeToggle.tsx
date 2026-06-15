'use client'

import type { JSX } from 'react'
import { useTheme } from '../lib/useTheme'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/**
 * Single-button switch that flips between the light and dark themes. Shows a
 * sun while dark (tap to lighten) and a moon while light (tap to darken).
 */
export function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme()
  const isDark: boolean = theme === 'dark'

  return (
    <IconButton
      label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={18} />
    </IconButton>
  )
}
