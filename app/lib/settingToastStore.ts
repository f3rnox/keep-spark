type SettingToastListener = () => void

/**
 * Visible state for the settings saved toast.
 */
export interface SettingToastState {
  message: string
  visible: boolean
}

const listeners: Set<SettingToastListener> = new Set<SettingToastListener>()

const VISIBLE_SERVER_SNAPSHOT: boolean = false
const MESSAGE_SERVER_SNAPSHOT: string = ''

let visibleSnapshot: boolean = VISIBLE_SERVER_SNAPSHOT
let messageSnapshot: string = MESSAGE_SERVER_SNAPSHOT

let hideTimer: ReturnType<typeof setTimeout> | null = null

let suppressNotifications: boolean = false

const TOAST_DURATION_MS: number = 2800

/**
 * Notifies all toast subscribers after state changes.
 */
function notifySettingToastListeners(): void {
  for (const listener of listeners) {
    listener()
  }
}

/**
 * Subscribes to setting toast visibility changes.
 *
 * @param listener Invoked whenever toast state updates.
 */
export function subscribeSettingToast(listener: SettingToastListener): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

/**
 * Client snapshot of whether the setting toast is visible.
 */
export function getSettingToastVisibleSnapshot(): boolean {
  return visibleSnapshot
}

/**
 * Server snapshot of toast visibility during SSR and hydration.
 */
export function getSettingToastVisibleServerSnapshot(): boolean {
  return VISIBLE_SERVER_SNAPSHOT
}

/**
 * Client snapshot of the active setting toast message.
 */
export function getSettingToastMessageSnapshot(): string {
  return messageSnapshot
}

/**
 * Server snapshot of the toast message during SSR and hydration.
 */
export function getSettingToastMessageServerSnapshot(): string {
  return MESSAGE_SERVER_SNAPSHOT
}

/**
 * Runs synchronous work without showing setting-saved toasts.
 *
 * @param run Work that updates multiple stored preferences at once.
 */
export function runWithoutSettingToast(run: () => void): void {
  suppressNotifications = true
  try {
    run()
  } finally {
    suppressNotifications = false
  }
}

/**
 * Shows a short confirmation that a setting was saved.
 *
 * @param message Confirmation text to display.
 */
export function showSettingSaved(message: string = 'Setting saved'): void {
  if (typeof window === 'undefined') return
  if (suppressNotifications) return

  if (hideTimer !== null) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  messageSnapshot = message
  visibleSnapshot = true
  notifySettingToastListeners()

  hideTimer = setTimeout((): void => {
    messageSnapshot = MESSAGE_SERVER_SNAPSHOT
    visibleSnapshot = VISIBLE_SERVER_SNAPSHOT
    notifySettingToastListeners()
    hideTimer = null
  }, TOAST_DURATION_MS)
}
