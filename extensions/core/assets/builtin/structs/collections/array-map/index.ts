export class ArrayMap<T, V> {
  private map: Map<T, V[]>;

  constructor() {
    this.map = new Map<T, V[]>();
  }

  has(key: T): boolean {
    return this.map.has(key);
  }

  /**
   * 设置键对应的数据
   */
  set(key: T, values: V[]): void {
    this.map.set(key, values);
  }

  /**
   * 向map中添加数据
   */
  setValue(key: T, value: V): void {
    if (this.map.has(key)) {
      this.map.get(key)!.push(value);
    } else {
      this.map.set(key, [value]);
    }
  }

  /**
   * 弹出最后一个
   */
  pop(key: T): V | null {
    return this.map.get(key)?.pop() ?? null;
  }

  /**
   * 弹出第一个
   */
  shift(key: T): V | null {
    return this.map.get(key)?.shift() ?? null;
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
   * 获取map的大小
   */
  size(): number {
    return this.map.size;
  }

  sizeValue(key: T): number {
    return this.map.get(key)?.length ?? 0;
  }

  allSizeValue(): number {
    let size = 0;
    this.forEach((values) => {
      size += values.length;
    });
    return size;
  }

  /**
   * 检查map是否为空
   */
  isEmpty(): boolean {
    return this.map.size === 0;
  }

  /**
   * 检查map是否为空
   */
  isEmptyValue(key: T): boolean {
    return !this.map.get(key)?.length;
  }

  /**
   * 删除整个键及其对应的数组
   */
  delete(key: T): boolean {
    return this.map.delete(key);
  }

  /**
   * 删除特定元素
   */
  deleteValue(value: V): boolean;
  deleteValue(key: T, value: V): boolean;
  deleteValue(arg1: any, arg2?: any): boolean {
    if (!arg2) {
      for (let [k, v] of this.map) {
        const index = v.indexOf(arg1);
        if (index !== -1) {
          v.splice(index, 1);
          if (v.length === 0) {
            this.map.delete(k);
          }
          return true;
        }
      }
    } else {
      if (this.map.has(arg1)) {
        const values = this.map.get(arg1)!;
        const index = values.indexOf(arg2);
        if (index !== -1) {
          values.splice(index, 1);
          if (values.length === 0) {
            this.map.delete(arg1);
          }
          return true;
        }
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
