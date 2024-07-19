import { _decorator, Component, Node, Tween } from "cc";
import { TweenUtil } from "core/builtin/utils/tween";
const { ccclass, property } = _decorator;

@ccclass("FingerComponent")
export class FingerComponent extends Component {
  @property({ tooltip: "手指震荡幅度" })
  amplitude = 20;

  protected onDisable(): void {
    Tween.stopAllByTarget(this.node);
  }

  set(node: Node) {
    TweenUtil.runStickAction(this.node, this.amplitude);
    this.node.worldPosition = node.worldPosition;
  }
}
