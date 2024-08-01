import { Layers, Node } from "cc";
import { UILayoutUtil } from "../../../../builtin/utils";
import { BaseView } from "../../../../builtin/components/ui/BaseView";

export class LayerBase extends Node {
  constructor(name?: string) {
    super(name);
    this.layer = Layers.BitMask.UI_2D;
    UILayoutUtil.alignFullScreen(this);
  }

  async addView(node: Node) {
    super.addChild(node);
    const bvC = node.getComponent(BaseView);
    return await bvC.constructor.prototype._show.call(bvC);
  }
}
