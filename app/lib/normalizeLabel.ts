/**
 * Trims and collapses internal whitespace in a raw label string.
 *
 * @param raw Unprocessed label text from user input.
 */
export function normalizeLabel(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}
