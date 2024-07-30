import { BaseView } from "builtin/components/ui/BaseView";
import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UITest")
export class UITest extends BaseView {
  protected onLoad(): void {
    console.log("加载啦", this.data);
  }
}
