/**
 * Toast组件
 * @description 自定义Toast请继承或直接使用此组件
 */
import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

export class Toast extends Component {
  @property({ type: Label, tooltip: "Toast文本组件" })
  declare toastLabel: Label;

  init(msg: string) {
    this.toastLabel.string = msg;
  }

  protected onDisable(): void {
    this.toastLabel.string = "";
  }
}
