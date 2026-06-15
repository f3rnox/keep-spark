import Link from 'next/link'
import type { ComponentProps, JSX, ReactNode } from 'react'

/**
 * Props for the `IconLink` component.
 */
export interface IconLinkProps extends Omit<ComponentProps<typeof Link>, 'children'> {
  label: string
  children: ReactNode
  active?: boolean
}

/**
 * Icon-only navigation link styled like `IconButton`.
 *
 * @param props.label Accessible name surfaced as `aria-label`/`title`.
 * @param props.children The icon (or other inline content) to render.
 * @param props.active Marks the link as visually active.
 */
export function IconLink({
  label,
  children,
  active = false,
  className = '',
  ...rest
}: IconLinkProps): JSX.Element {
  const base: string =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  const activeCls: string = active ? 'bg-surface-hover text-foreground' : ''

  return (
    <Link
      aria-label={label}
      title={label}
      className={`${base} ${activeCls} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Link>
  )
}
