import type { MetadataRoute } from 'next'

/**
 * Web app manifest served at `/manifest.webmanifest` for installable PWA support.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KeepSpark',
    short_name: 'KeepSpark',
    description: 'KeepSpark — a minimalist note-taking web UI',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#1c1917',
    orientation: 'any',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
