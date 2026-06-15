'use client'

import { useEffect, type JSX } from 'react'
import { registerServiceWorker } from '../lib/registerServiceWorker'

/**
 * Mounts once in the root layout to register the production service worker.
 */
export function ServiceWorkerRegistration(): JSX.Element | null {
  useEffect(registerServiceWorker, [])
  return null
}
