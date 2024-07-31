import app from "app";
import { BaseView } from "builtin/components/ui/BaseView";
import { btn } from "builtin/decorators";
import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UITest")
export class UITest extends BaseView {
  protected onShow(): Promise<void> | void {
    console.log("创建啦", this.data);
  }

  protected onHide(): Promise<void> | void {
    console.log("隐藏啦", this.data);
  }

  @btn({
    ms: 10000,
    callback() {
      console.log("点击了");
    },
  })
  toast() {
    app.ui.showToast("hahahahah");
  }
}
