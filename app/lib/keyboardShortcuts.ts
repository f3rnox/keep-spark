/**
 * One keyboard shortcut entry for the settings reference page.
 */
export interface KeyboardShortcut {
  keys: ReadonlyArray<string>
  description: string
  context?: string
}

/**
 * App-wide keyboard shortcuts surfaced in settings.
 */
export const KEYBOARD_SHORTCUTS: ReadonlyArray<KeyboardShortcut> = [
  { keys: ['N'], description: 'Create a new note' },
  { keys: ['/'], description: 'Focus the search field' },
  { keys: ['Esc'], description: 'Close the note editor or exit selection mode' },
  { keys: ['P'], description: 'Toggle pin on the open note', context: 'Note editor' },
  { keys: ['Ctrl', 'Z'], description: 'Undo the last change' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo the last undone change' },
]
