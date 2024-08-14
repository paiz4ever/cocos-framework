import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property, menu } = _decorator;

/**
 * Toast基础组件
 * @description 自定义Toast请继承或直接使用此组件
 */
@ccclass("BaseToast")
@menu("ui/BaseToast")
export class BaseToast extends Component {
  @property({ type: Label, tooltip: "Toast文本" })
  declare toastLabel: Label;

  init(msg: string) {
    this.toastLabel.string = msg;
  }

  protected onDisable(): void {
    this.toastLabel.string = "";
  }
}
