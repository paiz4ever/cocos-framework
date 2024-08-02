/**
 * 事件管理器
 */
import SingleEventEmitter from "../../../builtin/structs/abstract/SingleEventEmitter";

type TEvent = TInternalEvent & TGameEvent;

class EventManager extends SingleEventEmitter<TEvent> {
  public emit<K extends keyof TEvent>(
    key: K,
    ...data: TEvent[K] extends void
      ? []
      : TEvent[K] extends any[]
      ? TEvent[K]
      : [TEvent[K]]
  ) {
    super.emit(key, ...data);
  }
}

const EventMgr = EventManager.getInstance();
export default EventMgr;
