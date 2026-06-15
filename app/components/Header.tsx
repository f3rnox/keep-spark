'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type JSX,
  type KeyboardEvent,
} from 'react'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { IconLink } from './IconLink'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { GlobalEncryptionButton } from './GlobalEncryptionButton'
import { HeaderSignInButton } from './HeaderSignInButton'
import { ThemeToggle } from './ThemeToggle'

/**
 * Props for the top-level `Header` bar.
 */
export interface HeaderProps {
  query: string
  recents: ReadonlyArray<string>
  onQueryChange: (next: string) => void
  onSearchCommit: (query: string) => void
  onSelectRecent: (query: string) => void
  onRemoveRecent: (query: string) => void
  onClearRecents: () => void
}

/**
 * Sticky application header holding the minimalist wordmark, a centered search
 * field with recent searches, and the light/dark theme toggle.
 */
export const Header = forwardRef<HTMLInputElement, HeaderProps>(function Header(
  {
    query,
    recents,
    onQueryChange,
    onSearchCommit,
    onSelectRecent,
    onRemoveRecent,
    onClearRecents,
  },
  ref,
): JSX.Element {
  const pathname: string = usePathname()
  const settingsActive: boolean = pathname.startsWith('/settings')
  const [open, setOpen] = useState<boolean>(false)
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect((): (() => void) | void => {
    if (!open) return
    const handler = (event: MouseEvent): void => {
      if (!wrapperRef.current) return
      if (event.target instanceof Node && wrapperRef.current.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return (): void => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      onSearchCommit(query)
      setOpen(false)
    }
    if (event.key === 'Escape') setOpen(false)
  }

  return (
    <header className='safe-top sticky top-0 z-30 border-b border-border bg-canvas/80 backdrop-blur'>
      <div className='mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6'>
        <Link href='/' className='flex shrink-0 items-center gap-2' aria-label='KeepSpark home'>
          <span className='h-2.5 w-2.5 rounded-full bg-accent' />
          <span className='hidden text-[15px] font-semibold tracking-tight text-foreground sm:inline'>
            KeepSpark
          </span>
        </Link>

        <div className='ml-auto flex min-w-0 flex-1 items-center justify-end gap-0.5 sm:gap-2'>
          <div ref={wrapperRef} className='relative min-w-0 flex-1 max-w-md'>
          <label className='flex h-10 w-full items-center gap-2.5 rounded-xl border border-transparent bg-surface-hover px-3 text-muted transition focus-within:border-border focus-within:bg-surface'>
            <Icon name='search' size={18} />
            <input
              ref={ref}
              type='search'
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                onQueryChange(event.target.value)
              }
              onFocus={(): void => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder='Search notes'
              className='w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted'
            />
          </label>

          {open && recents.length > 0 ? (
            <div className='absolute left-0 right-0 top-11 z-40 rounded-xl border border-border bg-surface py-1 shadow-lg shadow-black/10'>
              <div className='flex items-center justify-between px-3 py-1.5'>
                <span className='text-[11px] font-medium text-muted'>Recent</span>
                <button
                  type='button'
                  onClick={onClearRecents}
                  className='text-[11px] text-muted hover:text-foreground'
                >
                  Clear
                </button>
              </div>
              {recents.map(
                (recent: string): JSX.Element => (
                  <div
                    key={recent}
                    className='flex items-center justify-between px-2 hover:bg-surface-hover'
                  >
                    <button
                      type='button'
                      onClick={(): void => {
                        onSelectRecent(recent)
                        setOpen(false)
                      }}
                      className='flex-1 px-1 py-1.5 text-left text-sm text-foreground'
                    >
                      {recent}
                    </button>
                    <button
                      type='button'
                      aria-label={`Remove ${recent}`}
                      onClick={(): void => onRemoveRecent(recent)}
                      className='px-2 py-1 text-muted hover:text-foreground'
                    >
                      <Icon name='close' size={14} />
                    </button>
                  </div>
                ),
              )}
            </div>
          ) : null}
          </div>

          <div className='flex shrink-0 items-center gap-0.5 sm:gap-1'>
            <GlobalEncryptionButton />
            <IconButton
              label='Keyboard shortcuts'
              className='hidden sm:inline-flex'
              onClick={(): void => setShortcutsOpen(true)}
            >
              <Icon name='keyboard' size={18} />
            </IconButton>
            <IconLink href='/settings' label='Settings' active={settingsActive}>
              <Icon name='settings' size={18} />
            </IconLink>
            <ThemeToggle />
            <HeaderSignInButton />
          </div>
        </div>
      </div>

      {shortcutsOpen ? (
        <KeyboardShortcutsModal onClose={(): void => setShortcutsOpen(false)} />
      ) : null}
    </header>
  )
})
