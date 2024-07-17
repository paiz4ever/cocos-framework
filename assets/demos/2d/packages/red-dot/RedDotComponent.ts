import { _decorator, CCString, Component, Label, Node, UIOpacity } from "cc";
import RedDotSys from "./index";
const { ccclass, property } = _decorator;

@ccclass("RedDotComponent")
export class RedDotComponent extends Component {
  @property({ tooltip: "红点的完整路径" })
  redDotPath: string = "";
  @property({ type: Label, tooltip: "红点数字" })
  declare redDotLabel?: Label;

  private declare opacityC: UIOpacity;
  private declare opacity: number;

  protected onLoad(): void {
    this.opacityC = this.getComponent(UIOpacity)!;
    if (!this.opacityC) {
      this.opacityC = this.node.addComponent(UIOpacity);
    }
    this.opacity = this.opacityC.opacity;
  }

  protected onEnable(): void {
    RedDotSys.on(this.redDotPath, this.refresh, this);
    this.refresh(RedDotSys.find(this.redDotPath)?.redNum ?? 0);
  }

  protected onDisable(): void {
    RedDotSys.offTarget(this);
  }

  refresh(num: number) {
    this.opacityC.opacity = num > 0 ? this.opacity : 0;
    this.redDotLabel && (this.redDotLabel.string = String(num));
  }
}
