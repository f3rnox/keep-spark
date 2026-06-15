'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState, type JSX, type ReactNode } from 'react'
import { buildHomeSearchUrl } from '../../lib/buildHomeSearchUrl'
import { useRecentSearches } from '../../lib/useRecentSearches'
import { Header } from '../Header'
import { SettingsNav } from './SettingsNav'

/**
 * Props for the settings page shell.
 */
export interface SettingsShellProps {
  title: string
  description: string
  children: ReactNode
}

/**
 * Layout wrapper for all settings sub-pages with sidebar navigation.
 *
 * @param props.title Active page title.
 * @param props.description Active page description.
 * @param props.children Page content.
 */
export function SettingsShell({
  title,
  description,
  children,
}: SettingsShellProps): JSX.Element {
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState<string>('')
  const { recents, commitSearch, removeRecent, clearRecents } = useRecentSearches()

  const navigateWithQuery = useCallback(
    (value: string): void => {
      const url: string = buildHomeSearchUrl(value)
      if (url === '/') return
      router.push(url)
    },
    [router],
  )

  const handleSearchCommit = useCallback(
    (value: string): void => {
      commitSearch(value)
      navigateWithQuery(value)
    },
    [commitSearch, navigateWithQuery],
  )

  const handleSelectRecent = useCallback(
    (value: string): void => {
      setQuery(value)
      commitSearch(value)
      navigateWithQuery(value)
    },
    [commitSearch, navigateWithQuery],
  )

  return (
    <div className='flex min-h-full flex-1 flex-col bg-canvas text-foreground'>
      <Header
        ref={searchRef}
        query={query}
        recents={recents}
        onQueryChange={setQuery}
        onSearchCommit={handleSearchCommit}
        onSelectRecent={handleSelectRecent}
        onRemoveRecent={removeRecent}
        onClearRecents={clearRecents}
      />

      <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-10'>
        <aside className='lg:w-72 lg:shrink-0'>
          <SettingsNav />
        </aside>

        <main className='min-w-0 flex-1 space-y-6'>
          <div className='space-y-1'>
            <h1 className='text-2xl font-semibold tracking-tight text-foreground'>{title}</h1>
            <p className='text-sm text-muted'>{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
