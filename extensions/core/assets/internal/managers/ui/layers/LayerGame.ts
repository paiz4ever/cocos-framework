import { _decorator, Component, Node } from "cc";
import { LayerBase } from "./base";
import { BaseView } from "../../../../builtin/components/ui/BaseView";
const { ccclass, property } = _decorator;

export default class LayerGame extends LayerBase {
  constructor() {
    super("__LayerGame__");
  }

  async addView(node: Node) {
    const old = this.children[0];
    await super.addView(node);
    if (old) {
      const bvC = old.getComponent(BaseView);
      bvC.constructor.prototype._hide.call(bvC, {
        onHide: null,
      });
    }
  }
}
