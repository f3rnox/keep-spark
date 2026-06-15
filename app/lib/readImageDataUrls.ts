/**
 * Reads image files from a paste or drop event and returns base64 data URLs.
 *
 * @param event Clipboard or drag event carrying files.
 */
export async function readImageDataUrls(
  event: ClipboardEvent | DragEvent,
): Promise<ReadonlyArray<string>> {
  const urls: string[] = []

  if ('clipboardData' in event && event.clipboardData !== null) {
    const items: DataTransferItemList = event.clipboardData.items
    for (let i: number = 0; i < items.length; i += 1) {
      const item: DataTransferItem = items[i]
      if (!item.type.startsWith('image/')) continue
      const file: File | null = item.getAsFile()
      if (file === null) continue
      const url: string = await fileToDataUrl(file)
      urls.push(url)
    }
    return urls
  }

  if ('dataTransfer' in event && event.dataTransfer !== null) {
    const files: FileList = event.dataTransfer.files
    for (let i: number = 0; i < files.length; i += 1) {
      const file: File = files[i]
      if (!file.type.startsWith('image/')) continue
      const url: string = await fileToDataUrl(file)
      urls.push(url)
    }
  }

  return urls
}

/**
 * Converts a single image file to a base64 data URL.
 *
 * @param file Image file to read.
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve: (url: string) => void): void => {
    const reader: FileReader = new FileReader()
    reader.onload = (): void => {
      if (typeof reader.result === 'string') resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
