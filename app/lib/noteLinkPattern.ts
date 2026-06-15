/**
 * Builds a case-insensitive regex matching `[[title]]` wiki-style links.
 *
 * @param title Note title to match inside double brackets.
 */
export function noteLinkPattern(title: string): RegExp {
  const escaped: string = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\[\\[${escaped}\\]\\]`, 'i')
}
