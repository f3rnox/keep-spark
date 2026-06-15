import type { MarkdownFormat } from './applyMarkdownFormat'

/**
 * Minimal keyboard event shape used to detect markdown formatting shortcuts.
 */
export interface MarkdownShortcutEvent {
  key: string
  code: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}

/**
 * Maps common editor shortcuts to a markdown format action.
 * Supports Ctrl/Cmd+B/I and Ctrl/Cmd+Alt/Shift+1–3 for headings.
 *
 * @param event Keyboard event from the note content textarea.
 */
export function resolveMarkdownShortcut(
  event: MarkdownShortcutEvent,
): MarkdownFormat | null {
  const mod: boolean = event.ctrlKey || event.metaKey
  if (!mod) return null

  const key: string = event.key.toLowerCase()

  if (!event.altKey && !event.shiftKey && key === 'b') return 'bold'
  if (!event.altKey && !event.shiftKey && key === 'i') return 'italic'

  if (!event.shiftKey && event.altKey && event.code === 'Digit1') return 'h1'
  if (!event.shiftKey && event.altKey && event.code === 'Digit2') return 'h2'
  if (!event.shiftKey && event.altKey && event.code === 'Digit3') return 'h3'

  if (!event.altKey && event.shiftKey && event.code === 'Digit1') return 'h1'
  if (!event.altKey && event.shiftKey && event.code === 'Digit2') return 'h2'
  if (!event.altKey && event.shiftKey && event.code === 'Digit3') return 'h3'

  return null
}
