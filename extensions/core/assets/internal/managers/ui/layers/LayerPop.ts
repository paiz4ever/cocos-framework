import { _decorator, Component, Node } from "cc";
import { LayerBase } from "./base";
import { UIViewUtil } from "../../../../builtin/utils";
const { ccclass, property } = _decorator;

export default class LayerPop extends LayerBase {
  private declare shade: Node;

  constructor() {
    super("__LayerPop__");
    this.shade = UIViewUtil.createShade({
      name: "__PopMask__",
      parent: this,
    });
    this.shade.active = false;
    this.on(Node.EventType.CHILD_ADDED, this.refreshShade, this);
    this.on(Node.EventType.CHILD_REMOVED, this.refreshShade, this);
  }

  refreshShade() {
    if (this.children.length <= 1) {
      this.shade.active = false;
    } else {
      this.shade.active = true;
      this.shade.setSiblingIndex(this.children.length - 2);
    }
  }
}
