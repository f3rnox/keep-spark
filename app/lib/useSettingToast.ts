'use client'

import { useMemo, useSyncExternalStore } from 'react'
import {
  getSettingToastMessageServerSnapshot,
  getSettingToastMessageSnapshot,
  getSettingToastVisibleServerSnapshot,
  getSettingToastVisibleSnapshot,
  subscribeSettingToast,
  type SettingToastState,
} from './settingToastStore'

/**
 * Subscribes to the shared setting toast store.
 */
export function useSettingToast(): SettingToastState {
  const visible: boolean = useSyncExternalStore(
    subscribeSettingToast,
    getSettingToastVisibleSnapshot,
    getSettingToastVisibleServerSnapshot,
  )
  const message: string = useSyncExternalStore(
    subscribeSettingToast,
    getSettingToastMessageSnapshot,
    getSettingToastMessageServerSnapshot,
  )

  return useMemo(
    (): SettingToastState => ({ message, visible }),
    [message, visible],
  )
}
