/**
 * Registers the offline service worker when running a production build in the browser.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', (): void => {
    void navigator.serviceWorker.register('/sw.js').catch((): void => undefined)
  })
}
