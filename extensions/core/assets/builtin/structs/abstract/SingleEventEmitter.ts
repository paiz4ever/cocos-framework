import EventEmitter from "./EventEmitter";

export default class SingleEventEmitter<T> extends EventEmitter<T> {
  static getInstance<T extends abstract new (...args: any) => any>(
    this: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    const self = this as any;
    if (!self._instance) {
      self._instance = new self(...args);
    }
    return self._instance;
  }
}
