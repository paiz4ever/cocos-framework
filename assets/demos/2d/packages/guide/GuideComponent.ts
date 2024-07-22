import { _decorator, CCInteger, Component, v3 } from "cc";
import GuideSys from "./index";
const { ccclass, property } = _decorator;

@ccclass("GuideComponent")
export class GuideComponent extends Component {
  @property({ type: CCInteger, tooltip: "引导步骤ID" })
  declare guideStepID: number;
  @property({ tooltip: "是否自动触发" })
  autoTrigger = true;
  @property({ tooltip: "引导节点名（存在多个目标时用作区分）" })
  guideName = "";
  @property({ tooltip: "是否是滑动引导" })
  isSlide = false;
  @property({
    tooltip: "滑动方向以及偏移",
    visible(this: GuideComponent) {
      return this.isSlide;
    },
  })
  slideDirection = v3(0, 0, 0);

  protected onEnable(): void {
    if (this.autoTrigger) {
      // @ts-ignore
      GuideSys.run(this);
    }
  }
}
