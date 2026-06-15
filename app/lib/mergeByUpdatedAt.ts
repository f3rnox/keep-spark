/**
 * Merges two collections by `id`, keeping the row with the newer `updatedAt`.
 *
 * @param local Local collection.
 * @param remote Remote collection.
 */
export function mergeByUpdatedAt<T extends { id: string; updatedAt: number }>(
  local: ReadonlyArray<T>,
  remote: ReadonlyArray<T>,
): ReadonlyArray<T> {
  const byId: Map<string, T> = new Map<string, T>()

  for (const item of local) {
    byId.set(item.id, item)
  }

  for (const item of remote) {
    const existing: T | undefined = byId.get(item.id)
    if (existing === undefined || item.updatedAt >= existing.updatedAt) {
      byId.set(item.id, item)
    }
  }

  return [...byId.values()]
}
