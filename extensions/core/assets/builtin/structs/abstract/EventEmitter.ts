/**
 * 事件发射器
 * 本身数据就支持数组的请在类型外包一层ToTuple，否则发送和监听处会被解构（参考 StorageManager）
 */
import { EventTarget } from "cc";

export default abstract class EventEmitter<T> {
  private et = new EventTarget();

  protected emit<K extends keyof T & string>(
    key: K,
    ...data: T[K] extends void ? [] : T[K] extends any[] ? T[K] : [T[K]]
  ) {
    this.et.emit(key, ...(data as [any]));
  }

  on<K extends keyof T & string>(
    key: K,
    listener: EventCallback<T[K]>,
    thisArg?: any
  ) {
    this.et.on(key, listener, thisArg);
  }

  once<K extends keyof T & string>(
    key: K,
    listener: EventCallback<T[K]>,
    thisArg?: any
  ) {
    this.et.once(key, listener, thisArg);
  }

  off<K extends keyof T & string>(
    key: K,
    listener?: EventCallback<T[K]>,
    thisArg?: any
  ) {
    this.et.off(key, listener, thisArg);
  }

  offTarget(thisArg: any) {
    this.et.targetOff(thisArg);
  }
}
