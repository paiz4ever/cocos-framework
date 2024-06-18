/**
 * 事件管理器
 */
import { EventTarget } from "cc";
import Singleton from "../../structs/abstract/Singleton";

type TEvent = TBuiltinEvent & TGameEvent;

class EventManager extends Singleton {
  private et = new EventTarget();

  /** 发送事件 */
  emit<T extends keyof TEvent>(event: T, ...args: TEvent[T]) {
    this.et.emit(event, ...(args || []));
  }

  /** 监听事件 */
  on<T extends keyof TEvent>(
    event: T,
    listener: (...args: TEvent[T]) => void,
    thisArg?: any
  ) {
    this.et.on(event, listener, thisArg);
  }

  /** 监听事件一次 */
  once<T extends keyof TEvent>(
    event: T,
    listener: (...args: TEvent[T]) => void,
    thisArg?: any
  ) {
    this.et.once(event, listener, thisArg);
  }

  /** 取消监听事件 */
  off<T extends keyof TEvent>(
    event: T,
    listener?: (...args: TEvent[T]) => void,
    thisArg?: any
  ) {
    this.et.off(event, listener, thisArg);
  }

  /** 取消监听所有 */
  offTarget(thisArg?: any) {
    this.et.targetOff(thisArg);
  }
}

const EventMgr = EventManager.getInstance();
export default EventMgr;
