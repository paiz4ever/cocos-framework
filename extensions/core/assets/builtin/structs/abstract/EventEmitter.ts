/**
 * 事件发射器
 */
import { EventTarget } from "cc";
import Singleton from "./Singleton";

export default abstract class EventEmitter<T> extends Singleton {
  private et = new EventTarget();

  /** 发送事件 */
  // protected emit<K extends keyof T & string>(key: K);
  // protected emit<K extends keyof T & string>(key: K, ...args: ArgArray<T[K]>);
  // TODO ArgArray<T[K]>导致emit类型提示问题 参见StorageMgr
  protected emit<K extends keyof T & string>(key: K, ...args: ArgArray<T[K]>) {
    this.et.emit(key, ...(args || []));
  }

  /** 监听缓存变化 */
  on<K extends keyof T & string>(
    key: K,
    // TODO boolean无法正常推断 （推断成true|false => any）
    listener: ExpandArgFuntion<T[K], void>,
    thisArg?: any
  ) {
    this.et.on(key, listener, thisArg);
  }

  /** 监听缓存变化一次 */
  once<K extends keyof T & string>(
    key: K,
    listener: ExpandArgFuntion<T[K], void>,
    thisArg?: any
  ) {
    this.et.once(key, listener, thisArg);
  }

  /** 取消监听 */
  off<K extends keyof T & string>(
    key: K,
    listener?: ExpandArgFuntion<T[K], void>,
    thisArg?: any
  ) {
    this.et.off(key, listener, thisArg);
  }

  /** 取消监听所有 */
  offTarget(thisArg: any) {
    this.et.targetOff(thisArg);
  }
}
