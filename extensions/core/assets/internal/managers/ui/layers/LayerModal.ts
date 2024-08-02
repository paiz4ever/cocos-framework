import { _decorator, Component, Node } from "cc";
import { LayerBase } from "./base";
import { UIViewUtil } from "../../../../builtin/utils";
const { ccclass, property } = _decorator;

export default class LayerModal extends LayerBase {
  private declare shade: Node;
  declare queue: Node[];

  constructor() {
    super("__LayerModal__");
    this.queue = [];
    this.shade = UIViewUtil.createShade({
      name: "__ModalMask__",
      parent: this,
    });
    this.shade.active = false;
    this.on(Node.EventType.CHILD_ADDED, this.refreshShade, this);
    this.on(Node.EventType.CHILD_REMOVED, this.refreshShade, this);
  }

  async addView(node: Node) {
    if (this.children.length >= 2) {
      this.queue.push(node);
      return;
    }
    return super.addView(node);
  }

  refreshShade() {
    if (this.queue.length) {
      this.addView(this.queue.shift());
      return;
    }
    if (this.children.length <= 1) {
      this.shade.active = false;
    } else {
      this.shade.active = true;
      this.shade.setSiblingIndex(0);
    }
  }
}
