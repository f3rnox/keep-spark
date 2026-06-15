/**
 * Triggers a browser download for a text file.
 *
 * @param filename Suggested download filename.
 * @param content File body.
 * @param mimeType MIME type for the blob.
 */
export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string = 'application/json',
): void {
  const blob: Blob = new Blob([content], { type: mimeType })
  const url: string = URL.createObjectURL(blob)
  const anchor: HTMLAnchorElement = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(url)
}
