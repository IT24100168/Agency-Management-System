
/**
 * Simple in-memory server-side cache with TTL.
 * Reduces redundant database queries for frequently accessed, rarely-changing data.
 * 
 * Usage:
 *   const data = getCached<MyType>('key') ?? await fetchAndCache('key', fetcher, 60)
 */

type CacheEntry<T> = {
    data: T
    expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

/**
 * Get a cached value by key. Returns null if not found or expired.
 */
export function getCached<T>(key: string): T | null {
    const entry = cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
        cache.delete(key)
        return null
    }
    return entry.data as T
}

/**
 * Set a value in the cache with a TTL in seconds.
 */
export function setCache<T>(key: string, data: T, ttlSeconds: number): void {
    cache.set(key, {
        data,
        expiresAt: Date.now() + ttlSeconds * 1000,
    })
}

/**
 * Invalidate cache entries. If a pattern is provided, only matching keys are removed.
 * If no pattern is provided, the entire cache is cleared.
 */
export function invalidateCache(keyPattern?: string): void {
    if (!keyPattern) {
        cache.clear()
        return
    }
    for (const key of cache.keys()) {
        if (key.includes(keyPattern)) {
            cache.delete(key)
        }
    }
}

/**
 * Helper: fetch data, cache it, and return it.
 * If cached data exists and is not expired, returns cached version without calling fetcher.
 */
export async function cachedFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number
): Promise<T> {
    const cached = getCached<T>(key)
    if (cached !== null) return cached

    const data = await fetcher()
    setCache(key, data, ttlSeconds)
    return data
}
