'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  getAutoLockMinutesServerSnapshot,
  getAutoLockMinutesSnapshot,
  setAutoLockMinutes,
  subscribeAutoLock,
  type AutoLockMinutes,
} from './autoLockStore'

/**
 * API exposed by the `useAutoLockPreference` hook.
 */
export interface AutoLockPreferenceApi {
  minutes: AutoLockMinutes
  setMinutes: (minutes: AutoLockMinutes) => void
}

/**
 * Subscribes to the auto-lock idle timeout preference.
 */
export function useAutoLockPreference(): AutoLockPreferenceApi {
  const minutes: AutoLockMinutes = useSyncExternalStore(
    subscribeAutoLock,
    getAutoLockMinutesSnapshot,
    getAutoLockMinutesServerSnapshot,
  )

  const setMinutes = useCallback((next: AutoLockMinutes): void => {
    setAutoLockMinutes(next)
  }, [])

  return { minutes, setMinutes }
}
