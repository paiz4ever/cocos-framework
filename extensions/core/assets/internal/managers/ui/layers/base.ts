import { Layers, Node } from "cc";
import { UILayoutUtil } from "../../../../builtin/utils";

export class LayerBase extends Node {
  constructor() {
    super();
    this.layer = Layers.BitMask.UI_2D;
    UILayoutUtil.alignFullScreen(this);
  }
}
