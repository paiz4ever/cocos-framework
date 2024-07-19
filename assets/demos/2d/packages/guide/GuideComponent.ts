import { _decorator, CCInteger, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GuideComponent")
export class GuideComponent extends Component {
  @property({ type: CCInteger, tooltip: "引导步骤ID" })
  declare guideStepID: number;
}
