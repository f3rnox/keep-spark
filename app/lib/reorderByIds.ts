/**
 * Reorders an array so that the items identified by `orderedIds` appear first
 * in that order, followed by any remaining items in their original order.
 *
 * @param items Full collection.
 * @param orderedIds Desired order of a subset (or all) item ids.
 * @param getId Extracts the id from each item.
 */
export function reorderByIds<T>(
  items: ReadonlyArray<T>,
  orderedIds: ReadonlyArray<string>,
  getId: (item: T) => string,
): ReadonlyArray<T> {
  const byId: Map<string, T> = new Map(
    items.map((item: T): [string, T] => [getId(item), item]),
  )
  const reordered: T[] = []

  for (const id of orderedIds) {
    const item: T | undefined = byId.get(id)
    if (item !== undefined) {
      reordered.push(item)
      byId.delete(id)
    }
  }

  for (const item of items) {
    const id: string = getId(item)
    if (byId.has(id)) reordered.push(item)
  }

  return reordered
}
