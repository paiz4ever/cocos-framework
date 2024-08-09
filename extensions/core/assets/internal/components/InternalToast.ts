import { _decorator, Component, Label, Node, UITransform } from "cc";
import { BaseToast } from "../../builtin/components/ui/BaseToast";
const { ccclass, property } = _decorator;

@ccclass("InternalToast")
export class InternalToast extends BaseToast {
  init(msg: string) {
    if (msg.length > 30) {
      this.toastLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
      this.toastLabel.getComponent(UITransform).width = 600;
    } else {
      this.toastLabel.overflow = Label.Overflow.NONE;
    }
    this.toastLabel.string = msg;
    this.toastLabel.updateRenderData(true);
  }
}
