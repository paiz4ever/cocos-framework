import { _decorator, CCString, Component, Label, Node, UIOpacity } from "cc";
import RedDotSys from "../../../internal/systems/RedDotSystem";
import { EDITOR } from "cc/env";
const { ccclass, property } = _decorator;

@ccclass("RedDot")
export class RedDot extends Component {
  @property
  _redDotPath: string = "";
  @property({ tooltip: "红点的完整路径" })
  get redDotPath() {
    return this._redDotPath;
  }
  set redDotPath(path: string) {
    this._redDotPath = path;
    if (EDITOR) return;
    this.trigger();
  }
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
    this.trigger();
  }

  protected onDisable(): void {
    RedDotSys.offTarget(this);
  }

  private trigger() {
    RedDotSys.offTarget(this);
    if (!this.redDotPath) return;
    RedDotSys.on(this.redDotPath, this.refresh, this);
    this.refresh(RedDotSys.find(this.redDotPath)?.redNum ?? 0);
  }

  private refresh(num: number) {
    this.opacityC.opacity = num > 0 ? this.opacity : 0;
    this.redDotLabel && (this.redDotLabel.string = String(num));
  }
}
