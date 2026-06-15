'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type JSX,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import type { Note, NoteColor } from '../lib/types'
import { getNoteColorClasses } from '../lib/colors'
import { ColorPicker } from './ColorPicker'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { LabelEditor } from './LabelEditor'
import { MarkdownToolbar } from './MarkdownToolbar'
import { handleMarkdownKeyDown } from '../lib/handleMarkdownKeyDown'

/**
 * Props for the `EditNoteModal` overlay.
 */
export interface EditNoteModalProps {
  note: Note
  onSave: (
    id: string,
    patch: {
      title: string
      content: string
      color: NoteColor
      labels: ReadonlyArray<string>
    },
  ) => void
  onTogglePinned: (id: string) => void
  onSetArchived: (id: string, archived: boolean) => void
  onSetTrashed: (id: string, trashed: boolean) => void
  onClose: () => void
}

/**
 * Modal note editor that opens when the user clicks an existing note tile,
 * mirroring Keep's expanded card. Auto-saves any pending edits when the
 * user closes the modal.
 *
 * @param props.note The note being edited (used to seed the form state).
 * @param props.onSave Persists the latest title/content/color/labels.
 * @param props.onTogglePinned Pin/unpin the note.
 * @param props.onSetArchived Archive/unarchive the note.
 * @param props.onSetTrashed Move the note to trash.
 * @param props.onClose Closes the modal (after autosaving).
 */
export function EditNoteModal({
  note,
  onSave,
  onTogglePinned,
  onSetArchived,
  onSetTrashed,
  onClose,
}: EditNoteModalProps): JSX.Element {
  const [title, setTitle] = useState<string>(note.title)
  const [content, setContent] = useState<string>(note.content)
  const [labels, setLabels] = useState<ReadonlyArray<string>>(note.labels)
  const [color, setColor] = useState<NoteColor>(note.color)
  const [showPalette, setShowPalette] = useState<boolean>(false)
  const contentRef = useRef<HTMLTextAreaElement | null>(null)

  const close = useCallback((): void => {
    onSave(note.id, { title, content, color, labels })
    onClose()
  }, [note.id, title, content, color, labels, onSave, onClose])

  useEffect((): (() => void) => {
    const handler = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', handler)
    return (): void => document.removeEventListener('keydown', handler)
  }, [close])

  const stop = (event: ReactMouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }

  const classes = getNoteColorClasses(color)
  const stripClass: string = classes.strip.length > 0 ? `border-l-4 ${classes.strip}` : ''

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Edit note'
      onClick={close}
      className='fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'
    >
      <div
        onClick={stop}
        onKeyDown={stop}
        className={`relative flex w-full max-w-xl flex-col rounded-2xl border border-border bg-surface ${classes.tint} ${stripClass} text-foreground shadow-2xl shadow-black/20`}
      >
        <div className='flex items-start justify-between gap-2 px-5 pt-4'>
          <input
            type='text'
            value={title}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setTitle(event.target.value)}
            placeholder='Title'
            className='w-full bg-transparent text-lg font-semibold tracking-tight outline-none placeholder:font-normal placeholder:text-muted'
            autoFocus
          />
          <span
            role='button'
            tabIndex={0}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            title={note.pinned ? 'Unpin note' : 'Pin note'}
            onClick={(): void => onTogglePinned(note.id)}
            onKeyDown={(event: KeyboardEvent<HTMLSpanElement>): void => {
              if (event.key !== 'Enter' && event.key !== ' ') return
              event.preventDefault()
              onTogglePinned(note.id)
            }}
            className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              note.pinned ? 'text-foreground' : 'text-muted'
            }`}
          >
            <Icon name={note.pinned ? 'pinFilled' : 'pin'} />
          </span>
        </div>

        <div className='px-5 pt-2'>
          <MarkdownToolbar
            textareaRef={contentRef}
            value={content}
            onChange={setContent}
          />
        </div>

        <textarea
          ref={contentRef}
          value={content}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>): void =>
            setContent(event.target.value)
          }
          onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>): void => {
            handleMarkdownKeyDown(event, content, setContent)
          }}
          placeholder='Write something...'
          rows={8}
          className='w-full resize-none bg-transparent px-5 py-3 text-[15px] leading-relaxed outline-none placeholder:text-muted'
        />

        <div className='px-5 pb-2'>
          <LabelEditor labels={labels} onChange={setLabels} />
        </div>

        <div className='relative flex items-center justify-between px-3 pb-3 pt-1'>
          <div className='flex items-center gap-1'>
            <IconButton
              label='Background options'
              active={showPalette}
              onClick={(): void => setShowPalette((prev: boolean): boolean => !prev)}
            >
              <Icon name='palette' size={18} />
            </IconButton>
            <IconButton
              label={note.archived ? 'Unarchive' : 'Archive'}
              onClick={(): void => onSetArchived(note.id, !note.archived)}
            >
              <Icon name={note.archived ? 'unarchive' : 'archive'} size={18} />
            </IconButton>
            <IconButton
              label='Move to trash'
              onClick={(): void => {
                onSetTrashed(note.id, true)
                onClose()
              }}
            >
              <Icon name='trash' size={18} />
            </IconButton>
          </div>

          <button
            type='button'
            onClick={close}
            className='rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            Done
          </button>

          {showPalette ? (
            <div className='absolute bottom-14 left-3 z-10 rounded-xl border border-border bg-surface p-2.5 shadow-lg shadow-black/5'>
              <ColorPicker value={color} onChange={setColor} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
