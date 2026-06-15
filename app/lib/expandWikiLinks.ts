/**
 * Converts `[[Note Title]]` wiki links into markdown links for custom rendering.
 *
 * @param content Raw note body.
 */
export function expandWikiLinks(content: string): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, '[$1](note:$1)')
}
