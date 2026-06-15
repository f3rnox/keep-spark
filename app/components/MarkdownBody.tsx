import Markdown from 'react-markdown'
import type { JSX } from 'react'

/**
 * Props for the `MarkdownBody` renderer.
 */
export interface MarkdownBodyProps {
  content: string
  className?: string
}

const MARKDOWN_PROSE_CLASS: string =
  'leading-relaxed text-inherit [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_h1]:mt-3 [&_h1]:mb-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-2.5 [&_h2]:mb-1 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:font-semibold [&_em]:italic'

/**
 * Renders note body text as markdown inside a styled container.
 *
 * @param props.content Raw markdown string to render.
 * @param props.className Optional extra classes on the wrapper.
 */
export function MarkdownBody({ content, className = '' }: MarkdownBodyProps): JSX.Element | null {
  if (content.length === 0) return null

  return (
    <div className={`${MARKDOWN_PROSE_CLASS} ${className}`.trim()}>
      <Markdown>{content}</Markdown>
    </div>
  )
}
