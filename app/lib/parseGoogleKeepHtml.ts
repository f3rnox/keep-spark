import type { ParsedGoogleKeepNote } from './parseGoogleKeepJson'

/**
 * Strips HTML tags and decodes common entities from Keep HTML exports.
 *
 * @param html Raw HTML fragment.
 */
function stripHtml(html: string): string {
  const withoutTags: string = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
  return withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Parses a Google Keep HTML export file into a normalized note shape.
 *
 * @param html Raw HTML from a Keep Takeout `.html` note file.
 */
export function parseGoogleKeepHtml(html: string): ParsedGoogleKeepNote | null {
  const titleMatch: RegExpMatchArray | null = html.match(
    /<div[^>]*class="[^"]*heading[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  )
  const contentMatch: RegExpMatchArray | null = html.match(
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  )

  const title: string = titleMatch !== null ? stripHtml(titleMatch[1]) : ''
  let content: string = contentMatch !== null ? stripHtml(contentMatch[1]) : ''

  const checklistItems: string[] = []
  const itemPattern: RegExp = /<div[^>]*class="[^"]*listitem[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
  let itemMatch: RegExpExecArray | null = itemPattern.exec(html)
  while (itemMatch !== null) {
    const itemHtml: string = itemMatch[1]
    const checked: boolean = /class="[^"]*checked[^"]*"/i.test(itemHtml)
    const text: string = stripHtml(itemHtml)
    if (text.length > 0) {
      checklistItems.push(`- [${checked ? 'x' : ' '}] ${text}`)
    }
    itemMatch = itemPattern.exec(html)
  }

  if (checklistItems.length > 0) {
    content = checklistItems.join('\n')
  }

  if (title.length === 0 && content.length === 0) return null

  const labels: string[] = []
  const labelPattern: RegExp = /<span[^>]*class="[^"]*label[^"]*"[^>]*>([\s\S]*?)<\/span>/gi
  let labelMatch: RegExpExecArray | null = labelPattern.exec(html)
  while (labelMatch !== null) {
    const label: string = stripHtml(labelMatch[1])
    if (label.length > 0) labels.push(label)
    labelMatch = labelPattern.exec(html)
  }

  const createdMatch: RegExpMatchArray | null = html.match(/Created:\s*([^<\n]+)/i)
  const createdAt: number =
    createdMatch !== null ? Date.parse(createdMatch[1].trim()) || Date.now() : Date.now()

  return {
    title,
    content,
    labels,
    listName: null,
    color: undefined,
    pinned: /class="[^"]*pinned[^"]*"/i.test(html),
    archived: /class="[^"]*archived[^"]*"/i.test(html),
    trashed: /class="[^"]*trashed[^"]*"/i.test(html),
    createdAt,
    updatedAt: createdAt,
  }
}
