import { _decorator, CCInteger, Component } from "cc";
import GuideSys from "./index";
const { ccclass, property } = _decorator;

@ccclass("GuideComponent")
export class GuideComponent extends Component {
  @property({ type: CCInteger, tooltip: "引导步骤ID" })
  declare guideStepID: number;
  @property({ tooltip: "是否自动触发" })
  autoTrigger = true;

  protected onEnable(): void {
    // @ts-ignore
    if (this.autoTrigger) GuideSys.run(this);
  }
}
