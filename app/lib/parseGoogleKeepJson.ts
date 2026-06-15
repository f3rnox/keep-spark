/**
 * Label applied to every note imported from Google Keep.
 */
export const GOOGLE_KEEP_IMPORT_LABEL: string = 'google-keep'

/**
 * Parsed Google Keep note prior to KeepSpark conversion.
 */
export interface ParsedGoogleKeepNote {
  title: string
  content: string
  labels: ReadonlyArray<string>
  listName: string | null
  color: string | undefined
  pinned: boolean
  archived: boolean
  trashed: boolean
  createdAt: number
  updatedAt: number
}

/**
 * Returns whether a parsed JSON value looks like a Google Keep note export.
 *
 * @param value Parsed JSON value.
 */
export function isGoogleKeepJsonNote(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const record: Record<string, unknown> = value as Record<string, unknown>
  return (
    typeof record.title === 'string' &&
    (typeof record.textContent === 'string' || Array.isArray(record.listContent)) &&
    typeof record.isTrashed === 'boolean' &&
    typeof record.isPinned === 'boolean' &&
    typeof record.isArchived === 'boolean'
  )
}

interface KeepListItem {
  text?: string
  isChecked?: boolean
}

/**
 * Converts Google Keep checklist items to markdown task list syntax.
 *
 * @param items Checklist entries from a Keep export.
 */
function listContentToMarkdown(items: ReadonlyArray<KeepListItem>): string {
  return items
    .map((item: KeepListItem): string => {
      const text: string = typeof item.text === 'string' ? item.text.trim() : ''
      const checked: boolean = item.isChecked === true
      return `- [${checked ? 'x' : ' '}] ${text}`
    })
    .join('\n')
}

/**
 * Parses a Google Keep JSON export object into a normalized note shape.
 *
 * @param value Parsed JSON value from a Keep export file.
 */
export function parseGoogleKeepJson(value: unknown): ParsedGoogleKeepNote | null {
  if (!isGoogleKeepJsonNote(value)) return null

  const record: Record<string, unknown> = value as Record<string, unknown>
  const title: string = typeof record.title === 'string' ? record.title.trim() : ''

  let content: string = ''
  if (Array.isArray(record.listContent) && record.listContent.length > 0) {
    content = listContentToMarkdown(record.listContent as ReadonlyArray<KeepListItem>)
  } else if (typeof record.textContent === 'string') {
    content = record.textContent.trim()
  }

  const labels: string[] = []
  if (Array.isArray(record.labels)) {
    for (const entry of record.labels) {
      if (typeof entry === 'object' && entry !== null && typeof (entry as { name?: string }).name === 'string') {
        const name: string = (entry as { name: string }).name.trim()
        if (name.length > 0) labels.push(name)
      }
    }
  }

  const createdUsec: number =
    typeof record.createdTimestampUsec === 'number'
      ? record.createdTimestampUsec
      : typeof record.userEditedTimestampUsec === 'number'
        ? record.userEditedTimestampUsec
        : Date.now() * 1000

  const updatedUsec: number =
    typeof record.userEditedTimestampUsec === 'number' ? record.userEditedTimestampUsec : createdUsec

  const listName: string | null =
    typeof record.listName === 'string' && record.listName.trim().length > 0
      ? record.listName.trim()
      : null

  return {
    title,
    content,
    labels,
    listName,
    color: typeof record.color === 'string' ? record.color : undefined,
    pinned: record.isPinned === true,
    archived: record.isArchived === true,
    trashed: record.isTrashed === true,
    createdAt: Math.floor(createdUsec / 1000),
    updatedAt: Math.floor(updatedUsec / 1000),
  }
}
