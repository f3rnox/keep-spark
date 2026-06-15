'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { JSX } from 'react'
import { Icon } from '../Icon'
import { SETTINGS_CATEGORIES, type SettingsCategory } from '../../lib/settingsCategories'

/**
 * Sidebar navigation for settings category sub-pages.
 */
export function SettingsNav(): JSX.Element {
  const pathname: string = usePathname()

  return (
    <nav aria-label='Settings' className='space-y-1'>
      {SETTINGS_CATEGORIES.map((category: SettingsCategory): JSX.Element => {
        const active: boolean = pathname === category.href

        return (
          <Link
            key={category.id}
            href={category.href}
            aria-current={active ? 'page' : undefined}
            className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              active
                ? 'bg-surface text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted hover:bg-surface-hover hover:text-foreground'
            }`}
          >
            <Icon name={category.icon} size={18} className='mt-0.5 shrink-0' />
            <span className='min-w-0'>
              <span className='block text-sm font-medium'>{category.label}</span>
              <span className='block text-xs leading-snug opacity-80'>{category.description}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
