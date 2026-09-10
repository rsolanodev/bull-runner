export interface PoolOptions<T> {
  onAcquire?: (item: T) => void;
  onRelease?: (item: T) => void;
}

export class Pool<T> {
  private readonly available: T[] = [];
  private readonly inUse = new Set<T>();
  private readonly options: PoolOptions<T>;

  constructor(
    private readonly factory: () => T,
    size: number,
    options: PoolOptions<T> = {},
  ) {
    this.options = options;
    for (let i = 0; i < size; i += 1) {
      this.available.push(factory());
    }
  }

  acquire(): T {
    const item = this.available.pop() ?? this.factory();
    this.inUse.add(item);
    this.options.onAcquire?.(item);
    return item;
  }

  release(item: T): void {
    if (!this.inUse.delete(item)) return;
    this.options.onRelease?.(item);
    this.available.push(item);
  }

  releaseAll(): void {
    for (const item of Array.from(this.inUse)) {
      this.release(item);
    }
  }

  get activeCount(): number {
    return this.inUse.size;
  }

  get size(): number {
    return this.available.length + this.inUse.size;
  }
}
