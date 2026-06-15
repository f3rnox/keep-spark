import { redirect } from 'next/navigation'

/**
 * Redirects `/settings` to the default general settings page.
 */
export default function SettingsIndexPage(): never {
  redirect('/settings/general')
}
