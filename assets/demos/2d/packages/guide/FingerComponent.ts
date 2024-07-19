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
    TweenUtil.runStickAction({
      node: this.node,
      amplitude: this.amplitude,
      frequency: 1,
    });
    this.node.worldPosition = node.worldPosition;
  }
}
