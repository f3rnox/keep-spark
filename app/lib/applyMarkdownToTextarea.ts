import { applyMarkdownFormat, type MarkdownFormat } from './applyMarkdownFormat'

/**
 * Applies a markdown format to the active textarea selection and restores
 * focus with the updated caret range.
 *
 * @param textarea Target textarea element.
 * @param value Current textarea value.
 * @param onChange Called with the updated markdown string.
 * @param format Formatting action to apply.
 */
export function applyMarkdownToTextarea(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (value: string) => void,
  format: MarkdownFormat,
): void {
  const result = applyMarkdownFormat(
    value,
    textarea.selectionStart,
    textarea.selectionEnd,
    format,
  )
  onChange(result.value)

  requestAnimationFrame((): void => {
    textarea.focus()
    textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
  })
}
