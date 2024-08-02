import { _decorator, Event, EventTarget, js, Node } from "cc";
import { LayerBase } from "./base";
const { ccclass, property } = _decorator;

const BlockEvents = [
  Node.EventType.TOUCH_START,
  Node.EventType.TOUCH_MOVE,
  Node.EventType.TOUCH_END,
  Node.EventType.TOUCH_CANCEL,
  Node.EventType.MOUSE_DOWN,
  Node.EventType.MOUSE_MOVE,
  Node.EventType.MOUSE_UP,
  Node.EventType.MOUSE_ENTER,
  Node.EventType.MOUSE_LEAVE,
  Node.EventType.MOUSE_WHEEL,
];

export default class LayerRoot extends LayerBase {
  private declare touchMap: Map<string, boolean>;
  private declare idg: js.IDGenerator;
  private declare et: EventTarget;

  constructor() {
    super("__LayerRoot__");
    this.touchMap = new Map();
    this.idg = new js.IDGenerator("LayerRoot");
    this.et = new EventTarget();
  }

  block() {
    this.register();
    const id = this.idg.getNewId();
    this.touchMap.set(id, true);
    return id;
  }

  unblock(uuid?: string) {
    if (!uuid) {
      this.touchMap.clear();
    } else {
      this.touchMap.delete(uuid);
    }
    this.unregister();
  }

  onTouch(callback: (evt: Event) => void) {
    this.register();
    this.et.on("user-touch", callback);
  }

  offTouch(callback: (evt: Event) => void) {
    this.et.off("user-touch", callback);
    this.unregister();
  }

  private handle(evt: Event) {
    evt.propagationStopped = !!this.touchMap.size;
    this.et.emit("user-touch", evt);
  }

  private register() {
    if (this.touchMap.size === 0 && !this.et.hasEventListener("user-touch")) {
      BlockEvents.forEach((evt) => {
        this.on(evt, this.handle, this, true);
      });
    }
  }

  private unregister() {
    if (this.touchMap.size === 0 && !this.et.hasEventListener("user-touch")) {
      BlockEvents.forEach((evt) => {
        this.off(evt, this.handle, this, true);
      });
    }
  }
}
