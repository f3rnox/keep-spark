'use client'

import type { ChangeEvent, JSX } from 'react'
import { Icon } from './Icon'
import { ThemeToggle } from './ThemeToggle'

/**
 * Props for the top-level `Header` bar.
 */
export interface HeaderProps {
  query: string
  onQueryChange: (next: string) => void
}

/**
 * Sticky application header holding the minimalist wordmark, a centered search
 * field, and the light/dark theme toggle.
 *
 * @param props.query Current search query value.
 * @param props.onQueryChange Invoked whenever the search input changes.
 */
export function Header({ query, onQueryChange }: HeaderProps): JSX.Element {
  return (
    <header className='sticky top-0 z-30 border-b border-border bg-canvas/80 backdrop-blur'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6'>
        <div className='flex shrink-0 items-center gap-2'>
          <span className='h-2.5 w-2.5 rounded-full bg-accent' />
          <span className='text-[15px] font-semibold tracking-tight text-foreground'>
            KeepSpark
          </span>
        </div>

        <label className='ml-auto flex h-10 w-full max-w-md items-center gap-2.5 rounded-xl border border-transparent bg-surface-hover px-3 text-muted transition focus-within:border-border focus-within:bg-surface'>
          <Icon name='search' size={18} />
          <input
            type='search'
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              onQueryChange(event.target.value)
            }
            placeholder='Search notes'
            className='w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted'
          />
        </label>

        <ThemeToggle />
      </div>
    </header>
  )
}
