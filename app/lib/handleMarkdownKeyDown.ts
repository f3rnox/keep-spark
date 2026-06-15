import type { KeyboardEvent } from 'react'
import { applyMarkdownToTextarea } from './applyMarkdownToTextarea'
import { resolveMarkdownShortcut } from './resolveMarkdownShortcut'

/**
 * Handles markdown formatting keyboard shortcuts on a note content textarea.
 * Returns whether the key event was consumed.
 *
 * @param event Keydown event from the content textarea.
 * @param value Current textarea value.
 * @param onChange Called with the updated markdown string when a shortcut matches.
 */
export function handleMarkdownKeyDown(
  event: KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (value: string) => void,
): boolean {
  const format = resolveMarkdownShortcut(event)
  if (!format) return false

  event.preventDefault()
  applyMarkdownToTextarea(event.currentTarget, value, onChange, format)
  return true
}
