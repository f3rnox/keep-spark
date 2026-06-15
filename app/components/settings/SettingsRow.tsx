import type { JSX, ReactNode } from 'react'

/**
 * Props for a single settings row with label and control.
 */
export interface SettingsRowProps {
  label: string
  description?: string
  children: ReactNode
}

/**
 * Horizontal settings row with label on the left and control on the right.
 *
 * @param props.label Primary row label.
 * @param props.description Optional supporting copy.
 * @param props.children Control rendered on the right.
 */
export function SettingsRow({
  label,
  description,
  children,
}: SettingsRowProps): JSX.Element {
  return (
    <div className='flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='min-w-0 flex-1 space-y-0.5'>
        <p className='text-sm font-medium text-foreground'>{label}</p>
        {description ? <p className='text-xs text-muted'>{description}</p> : null}
      </div>
      <div className='shrink-0'>{children}</div>
    </div>
  )
}
