'use client'

import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react'

/**
 * Props for the `IconButton` component.
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  active?: boolean
}

/**
 * A circular, icon-only button that mimics the unobtrusive controls Google
 * Keep places along the bottom of each note card. Forwards arbitrary
 * `<button>` props.
 *
 * @param props.label Accessible name surfaced as `aria-label`/`title`.
 * @param props.children The icon (or other inline content) to render.
 * @param props.active Marks the button as visually pressed (used for filters).
 */
export function IconButton({
  label,
  children,
  active = false,
  className = '',
  ...rest
}: IconButtonProps): JSX.Element {
  const base: string =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted'
  const activeCls: string = active ? 'bg-surface-hover text-foreground' : ''

  return (
    <button
      type='button'
      aria-label={label}
      title={label}
      className={`${base} ${activeCls} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}
