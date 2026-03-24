/**
 * Returns a function that lazily loads all records once per process lifetime.
 * Subsequent calls return the cached result without hitting the database.
 */
export function makeCache<T>(load: () => Promise<T[]>): () => Promise<T[]> {
  let cache: T[] | null = null;
  return async () => {
    if (cache === null) cache = await load();
    return cache;
  };
}
