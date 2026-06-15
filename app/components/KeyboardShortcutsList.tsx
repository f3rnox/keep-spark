import type { JSX } from 'react'
import { KEYBOARD_SHORTCUTS, type KeyboardShortcut } from '../lib/keyboardShortcuts'

/**
 * Renders the keyboard shortcut reference rows.
 */
export function KeyboardShortcutsList(): JSX.Element {
  return (
    <ul className='divide-y divide-border'>
      {KEYBOARD_SHORTCUTS.map((shortcut: KeyboardShortcut): JSX.Element => (
        <li
          key={shortcut.description}
          className='flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
        >
          <div className='space-y-0.5'>
            <p className='text-sm font-medium text-foreground'>{shortcut.description}</p>
            {shortcut.context ? (
              <p className='text-xs text-muted'>{shortcut.context}</p>
            ) : null}
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {shortcut.keys.map((key: string): JSX.Element => (
              <kbd
                key={`${shortcut.description}-${key}`}
                className='rounded-md border border-border bg-canvas px-2 py-1 text-xs font-medium text-foreground'
              >
                {key}
              </kbd>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
