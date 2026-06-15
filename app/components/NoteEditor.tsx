'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type JSX,
  type KeyboardEvent,
} from 'react'
import type { NoteColor } from '../lib/types'
import { getNoteColorClasses } from '../lib/colors'
import { ColorPicker } from './ColorPicker'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { LabelEditor } from './LabelEditor'
import { MarkdownToolbar } from './MarkdownToolbar'
import { handleMarkdownKeyDown } from '../lib/handleMarkdownKeyDown'

/**
 * Props for the inline `NoteEditor` placed at the top of the notes view.
 */
export interface NoteEditorProps {
  listId?: string | null
  onCreate: (
    title: string,
    content: string,
    color: NoteColor,
    labels: ReadonlyArray<string>,
    listId?: string | null,
  ) => void
}

/**
 * Compact-to-expanded inline editor that mirrors Google Keep's "Take a
 * note..." widget. Collapses back to its prompt state after submitting or
 * when the user clicks outside.
 *
 * @param props.onCreate Invoked with the trimmed title/content/color/labels when
 *                       the user finishes composing a note.
 */
export function NoteEditor({ listId = null, onCreate }: NoteEditorProps): JSX.Element {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [labels, setLabels] = useState<ReadonlyArray<string>>([])
  const [color, setColor] = useState<NoteColor>('default')
  const [showPalette, setShowPalette] = useState<boolean>(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLTextAreaElement | null>(null)

  const reset = useCallback((): void => {
    setTitle('')
    setContent('')
    setLabels([])
    setColor('default')
    setExpanded(false)
    setShowPalette(false)
  }, [])

  const submit = useCallback((): void => {
    if (title.trim().length === 0 && content.trim().length === 0) {
      reset()
      return
    }
    onCreate(title, content, color, labels, listId)
    reset()
  }, [title, content, color, labels, listId, onCreate, reset])

  useEffect((): (() => void) | void => {
    if (!expanded) return
    const handler = (event: MouseEvent): void => {
      if (!wrapperRef.current) return
      if (event.target instanceof Node && wrapperRef.current.contains(event.target)) return
      submit()
    }
    document.addEventListener('mousedown', handler)
    return (): void => document.removeEventListener('mousedown', handler)
  }, [expanded, submit])

  useEffect((): void => {
    if (expanded && contentRef.current) {
      contentRef.current.focus()
    }
  }, [expanded])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      reset()
    }
  }

  const classes = getNoteColorClasses(color)
  const stripClass: string = classes.strip.length > 0 ? `border-l-4 ${classes.strip}` : ''

  return (
    <div className='flex w-full justify-center'>
      <div
        ref={wrapperRef}
        onKeyDown={handleKeyDown}
        className={`w-full max-w-2xl rounded-xl border border-border bg-surface ${classes.tint} ${stripClass} transition-colors`}
      >
        {expanded ? (
          <div className='flex flex-col gap-1 px-4 py-3.5'>
            <input
              type='text'
              value={title}
              onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                setTitle(event.target.value)
              }
              placeholder='Title'
              className='w-full bg-transparent text-[15px] font-semibold tracking-tight text-foreground outline-none placeholder:font-normal placeholder:text-muted'
            />
            <MarkdownToolbar
              textareaRef={contentRef}
              value={content}
              onChange={setContent}
            />
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
              rows={3}
              className='w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted'
            />
            <LabelEditor labels={labels} onChange={setLabels} />
            <div className='relative mt-1 flex items-center justify-between'>
              <div className='flex items-center'>
                <IconButton
                  label='Background options'
                  active={showPalette}
                  onClick={(): void => setShowPalette((prev: boolean): boolean => !prev)}
                >
                  <Icon name='palette' size={18} />
                </IconButton>
              </div>
              <button
                type='button'
                onClick={submit}
                className='rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
                Add
              </button>
              {showPalette ? (
                <div className='absolute left-0 top-11 z-10 rounded-xl border border-border bg-surface p-2.5 shadow-lg shadow-black/5'>
                  <ColorPicker value={color} onChange={setColor} />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <button
            type='button'
            onClick={(): void => setExpanded(true)}
            className='flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-muted transition-colors hover:text-foreground'
          >
            <span>Write something...</span>
            <span className='text-muted'>
              <Icon name='plus' size={18} />
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
