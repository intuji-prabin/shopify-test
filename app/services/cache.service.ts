class CacheManager {
  cache: Map<string, any>;

  constructor() {
    this.cache = new Map();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get<T>(key: string): T {
    return this.cache.get(key);
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export default CacheManager;
