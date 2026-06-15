'use client'

import { useSyncExternalStore } from 'react'

const MEDIA_QUERY_SERVER_SNAPSHOT: boolean = false

type MediaQueryListener = () => void

interface MediaQueryStore {
  subscribe: (listener: MediaQueryListener) => () => void
  getSnapshot: () => boolean
}

const mediaQueryStores: Map<string, MediaQueryStore> = new Map<string, MediaQueryStore>()

/**
 * Returns a cached external store for a CSS media query string.
 *
 * @param query Media query string, e.g. `(min-width: 1024px)`.
 */
function getMediaQueryStore(query: string): MediaQueryStore {
  const existing: MediaQueryStore | undefined = mediaQueryStores.get(query)
  if (existing !== undefined) return existing

  const listeners: Set<MediaQueryListener> = new Set<MediaQueryListener>()
  let snapshot: boolean = MEDIA_QUERY_SERVER_SNAPSHOT
  let media: MediaQueryList | null = null
  let onChange: (() => void) | null = null

  const store: MediaQueryStore = {
    subscribe(listener: MediaQueryListener): () => void {
      listeners.add(listener)

      if (typeof window !== 'undefined' && media === null) {
        media = window.matchMedia(query)
        snapshot = media.matches
        onChange = (): void => {
          if (media === null) return
          const next: boolean = media.matches
          if (next === snapshot) return
          snapshot = next
          for (const subscriber of listeners) subscriber()
        }
        media.addEventListener('change', onChange)
      }

      return (): void => {
        listeners.delete(listener)
        if (listeners.size === 0 && media !== null && onChange !== null) {
          media.removeEventListener('change', onChange)
          media = null
          onChange = null
        }
      }
    },
    getSnapshot(): boolean {
      if (typeof window === 'undefined') return MEDIA_QUERY_SERVER_SNAPSHOT
      if (media === null) {
        media = window.matchMedia(query)
        snapshot = media.matches
      }
      return snapshot
    },
  }

  mediaQueryStores.set(query, store)
  return store
}

/**
 * Returns the cached server snapshot for media query subscriptions.
 */
function getMediaQueryServerSnapshot(): boolean {
  return MEDIA_QUERY_SERVER_SNAPSHOT
}

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 *
 * @param query Media query string, e.g. `(min-width: 1024px)`.
 */
export function useMediaQuery(query: string): boolean {
  const store: MediaQueryStore = getMediaQueryStore(query)
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getMediaQueryServerSnapshot,
  )
}
