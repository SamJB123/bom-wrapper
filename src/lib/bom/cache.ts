type CacheEntry<TValue> = {
  expiresAt: number
  value: Promise<TValue>
}

const cacheStore = new Map<string, CacheEntry<unknown>>()

export async function withCache<TValue>(
  key: string,
  ttlMs: number,
  loader: () => Promise<TValue>,
) {
  const now = Date.now()
  const existingEntry = cacheStore.get(key)

  if (existingEntry && existingEntry.expiresAt > now) {
    return existingEntry.value as Promise<TValue>
  }

  const valuePromise = loader()

  cacheStore.set(key, {
    expiresAt: now + ttlMs,
    value: valuePromise,
  })

  try {
    return await valuePromise
  } catch (error) {
    cacheStore.delete(key)
    throw error
  }
}

export function clearBomCache() {
  cacheStore.clear()
}
