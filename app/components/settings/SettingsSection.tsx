import type { JSX, ReactNode } from 'react'

/**
 * Props for a titled settings section block.
 */
export interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
}

/**
 * Groups related settings rows under a heading and optional description.
 *
 * @param props.title Section heading.
 * @param props.description Optional supporting copy.
 * @param props.children Settings controls for this section.
 */
export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps): JSX.Element {
  return (
    <section className='space-y-3'>
      <div className='space-y-1'>
        <h2 className='text-sm font-semibold text-foreground'>{title}</h2>
        {description ? <p className='text-sm text-muted'>{description}</p> : null}
      </div>
      <div className='overflow-hidden rounded-xl border border-border bg-surface divide-y divide-border'>
        {children}
      </div>
    </section>
  )
}
