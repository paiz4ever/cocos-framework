import { _decorator, Component, Label, Node, UITransform } from "cc";
import { Toast } from "../../builtin/components/ui/Toast";
const { ccclass, property } = _decorator;

@ccclass("InternalToast")
export class InternalToast extends Toast {
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
