'use client'

import type { JSX } from 'react'
import type { EditorPane } from '../lib/types'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

/**
 * Props for the editor pane mode toggle control.
 */
export interface EditorPaneSelectorProps {
  editorPane: EditorPane
  onChange: (next: EditorPane) => void
}

/**
 * Toggles between overlay modal and split-pane note editing on wide screens.
 *
 * @param props.editorPane Currently active editor presentation.
 * @param props.onChange Invoked with the next mode when toggled.
 */
export function EditorPaneSelector({
  editorPane,
  onChange,
}: EditorPaneSelectorProps): JSX.Element {
  const isSplit: boolean = editorPane === 'split'

  return (
    <IconButton
      label={isSplit ? 'Switch to overlay editor' : 'Switch to split-pane editor'}
      active={isSplit}
      onClick={(): void => onChange(isSplit ? 'overlay' : 'split')}
    >
      <Icon name={isSplit ? 'panel' : 'overlay'} size={18} />
    </IconButton>
  )
}
