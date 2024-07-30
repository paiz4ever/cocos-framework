export class ArrayMap<T, V> {
  private map: Map<T, V[]>;

  constructor() {
    this.map = new Map<T, V[]>();
  }

  /**
   * 向map中添加数据
   */
  add(key: T, value: V): void {
    if (this.map.has(key)) {
      this.map.get(key)!.push(value);
    } else {
      this.map.set(key, [value]);
    }
  }

  /**
   * 获取键对应的数据
   */
  get(key: T): V[] {
    return this.map.get(key);
  }

  /**
   * 遍历map
   */
  forEach(callback: (values: V[], key: T) => void): void {
    this.map.forEach(callback);
  }

  /**
   * 遍历指定键的值
   */
  forEachValue(key: T, callback: (value: V) => void): void {
    const values = this.map.get(key);
    if (values && values.length) {
      values.forEach(callback);
    }
  }

  /**
   * 删除特定元素
   */
  removeValue(key: T, value: V): boolean {
    if (this.map.has(key)) {
      const values = this.map.get(key)!;
      const index = values.indexOf(value);
      if (index !== -1) {
        values.splice(index, 1);
        if (values.length === 0) {
          this.map.delete(key);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * 清空map
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * 获取map的大小
   */
  size(): number {
    return this.map.size;
  }

  /**
   * 检查map是否为空
   */
  isEmpty(): boolean {
    return this.map.size === 0;
  }

  /**
   * 删除整个键及其对应的数组
   */
  delete(key: T): boolean {
    return this.map.delete(key);
  }

  /**
   * 获取map的键的迭代器
   */
  keys(): T[] {
    return [...this.map.keys()];
  }

  /**
   * 获取所有值
   */
  allValues(): V[] {
    return [...this.map.values()].flat();
  }

  /**
   * 转换map为数组，每个元素是一个[key, value]对
   */
  toArray(): [T, V[]][] {
    return [...this.map.entries()];
  }
}
