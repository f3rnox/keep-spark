/**
 * Builds the home route URL with an optional search query parameter.
 *
 * @param query Search text to encode in the URL.
 */
export function buildHomeSearchUrl(query: string): string {
  const trimmed: string = query.trim()
  if (trimmed.length === 0) return '/'
  return `/?q=${encodeURIComponent(trimmed)}`
}
