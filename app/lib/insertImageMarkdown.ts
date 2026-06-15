/**
 * Inserts a base64 image markdown reference at the cursor position in content.
 *
 * @param content Current note body.
 * @param dataUrl Base64 data URL for the image.
 * @param cursorStart Selection start offset.
 * @param cursorEnd Selection end offset.
 */
export function insertImageMarkdown(
  content: string,
  dataUrl: string,
  cursorStart: number,
  cursorEnd: number,
): string {
  const snippet: string = `\n![image](${dataUrl})\n`
  return content.slice(0, cursorStart) + snippet + content.slice(cursorEnd)
}
