import type { Metadata } from 'next'
import type { JSX, ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Settings · KeepSpark',
  description: 'Configure KeepSpark preferences and manage local data.',
}

/**
 * Shared layout wrapper for all settings routes.
 *
 * @param props.children Active settings sub-page.
 */
export default function SettingsLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return <>{children}</>
}
