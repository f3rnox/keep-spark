'use client'

import { useSyncExternalStore } from 'react'

const subscribeNoop = (): (() => void) => (): void => undefined

const getClientSnapshot = (): boolean => true

const getServerSnapshot = (): boolean => false

/**
 * Returns whether the component is running in the browser after hydration.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)
}
