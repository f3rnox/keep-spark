import { THEME_STORAGE_KEY } from './theme'

/**
 * Render-blocking script injected at the top of the document body. It applies
 * the persisted (or system-preferred) theme to the document element before
 * React hydrates, preventing a flash of the wrong color scheme on load.
 */
export const THEME_SCRIPT: string = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(d?'dark':'light');var e=document.documentElement;e.classList.toggle('dark',t==='dark');e.style.colorScheme=t;}catch(_){}})()`
