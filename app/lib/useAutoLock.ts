'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import {
  getAutoLockMinutesServerSnapshot,
  getAutoLockMinutesSnapshot,
  subscribeAutoLock,
} from './autoLockStore'
import { lockGlobalEncryptionSession } from './globalEncryptionSession'
import { hasActiveEncryptionSessions } from './hasActiveEncryptionSessions'
import { getEncryptionSessionVersion, subscribeEncryptionSession } from './encryptionSessionStore'
import {
  getGlobalEncryptionVersion,
  subscribeGlobalEncryption,
} from './globalEncryptionSession'

const ACTIVITY_EVENTS: ReadonlyArray<string> = [
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'click',
]

/**
 * Locks encryption sessions after configured idle time while a session is active.
 */
export function useAutoLock(): void {
  const minutes: number = useSyncExternalStore(
    subscribeAutoLock,
    getAutoLockMinutesSnapshot,
    getAutoLockMinutesServerSnapshot,
  )

  const globalVersion: number = useSyncExternalStore(
    subscribeGlobalEncryption,
    getGlobalEncryptionVersion,
    (): number => 0,
  )

  const sessionVersion: number = useSyncExternalStore(
    subscribeEncryptionSession,
    getEncryptionSessionVersion,
    (): number => 0,
  )

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef<boolean>(false)

  void globalVersion
  void sessionVersion

  useEffect((): (() => void) => {
    if (minutes <= 0) {
      activeRef.current = false
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return (): void => {}
    }

    const scheduleLock = (): void => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }

      if (!hasActiveEncryptionSessions()) {
        activeRef.current = false
        return
      }

      activeRef.current = true
      timeoutRef.current = setTimeout((): void => {
        if (hasActiveEncryptionSessions()) {
          lockGlobalEncryptionSession()
        }
        activeRef.current = false
      }, minutes * 60_000)
    }

    const handleActivity = (): void => {
      if (!hasActiveEncryptionSessions()) {
        activeRef.current = false
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        return
      }
      scheduleLock()
    }

    const handleVisibility = (): void => {
      if (document.visibilityState === 'hidden') {
        if (hasActiveEncryptionSessions()) {
          lockGlobalEncryptionSession()
        }
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        return
      }
      handleActivity()
    }

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, handleActivity, { passive: true })
    }
    document.addEventListener('visibilitychange', handleVisibility)

    handleActivity()

    return (): void => {
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, handleActivity)
      }
      document.removeEventListener('visibilitychange', handleVisibility)
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [minutes, globalVersion, sessionVersion])
}
