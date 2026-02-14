import { GISFeature } from './types';

interface CacheEntry {
  data: GISFeature[];
  expiry: number;
}

const CACHE = new Map<string, CacheEntry>();
const TTL_MS = (process.env.GIS_CACHE_TTL_S ? parseInt(process.env.GIS_CACHE_TTL_S) : 60) * 1000;
const MAX_SIZE = 100; // Limit cache size

export function getCachedFeatures(key: string): GISFeature[] | null {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    CACHE.delete(key);
    return null;
  }
  return entry.data;
}

export function setCachedFeatures(key: string, data: GISFeature[]): void {
  if (CACHE.size >= MAX_SIZE) {
    // Evict oldest (simple strategy: first key)
    const firstKey = CACHE.keys().next().value;
    CACHE.delete(firstKey);
  }
  CACHE.set(key, {
    data,
    expiry: Date.now() + TTL_MS
  });
}
