/**
 * 事件发射器
 * 本身数据就支持数组的请在类型外包一层ToTuple，否则发送和监听处会被解构（参考 StorageManager）
 */
import { EventTarget } from "cc";

export default abstract class EventEmitter<T> {
  private et = new EventTarget();

  /** 发送事件 */
  protected emit<K extends keyof T & string>(
    key: K,
    ...data: T[K] extends void ? [] : T[K] extends any[] ? T[K] : [T[K]]
  ) {
    this.et.emit(key, ...(data as [any]));
  }

  /** 监听事件 */
  on<K extends keyof T & string>(
    key: K,
    listener: EventCallback<T[K]>,
    thisArg?: any
  ) {
    this.et.on(key, listener, thisArg);
  }

  /** 监听事件一次 */
  once<K extends keyof T & string>(
    key: K,
    listener: EventCallback<T[K]>,
    thisArg?: any
  ) {
    this.et.once(key, listener, thisArg);
  }

  /** 取消监听事件 */
  off<K extends keyof T & string>(
    key: K,
    listener?: EventCallback<T[K]>,
    thisArg?: any
  ) {
    this.et.off(key, listener, thisArg);
  }

  /** 取消监听所有 */
  offTarget(thisArg: any) {
    this.et.targetOff(thisArg);
  }
}
