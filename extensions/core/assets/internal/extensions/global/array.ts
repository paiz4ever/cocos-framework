import { EDITOR } from "cc/env";

if (!EDITOR) {
  Array.prototype.shuffle = function <T>(): Array<T> {
    const array = this;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  Array.prototype.unique = function <T>(): Array<T> {
    return Array.from(new Set(this));
  };

  Array.prototype.last = function <T>(): T | undefined {
    return this.length > 0 ? this[this.length - 1] : undefined;
  };
}
