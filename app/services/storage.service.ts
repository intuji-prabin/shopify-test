class StorageService<T> {
  private storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  public get(key: string): T | null {
    const storedValue = this.storage.getItem(key);
    return storedValue ? JSON.parse(storedValue) as T : null;
  }

  public set(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string) {
    this.storage.removeItem(key);
  }

  public clear() {
    this.storage.clear();
  }
}

export default StorageService;