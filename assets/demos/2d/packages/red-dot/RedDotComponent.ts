import { _decorator, CCString, Component, Label, Node } from "cc";
import RedDotSys from "./index";
const { ccclass, property } = _decorator;

@ccclass("RedDotComponent")
export class RedDotComponent extends Component {
  @property({ type: CCString, tooltip: "红点的完整路径" })
  redPath: string = "";
  @property({ type: Node, tooltip: "红点节点" })
  declare redDot: Node;
  @property({ type: Label, tooltip: "红点数字" })
  declare redNum?: Label;

  protected onEnable(): void {
    RedDotSys.on(this.redPath, this.refresh, this);
    this.refresh(RedDotSys.find(this.redPath)?.redNum ?? 0);
  }

  protected onDisable(): void {
    RedDotSys.offTarget(this);
  }

  refresh(num: number) {
    this.redDot.active = num > 0;
    this.redNum && (this.redNum.string = String(num));
  }
}
