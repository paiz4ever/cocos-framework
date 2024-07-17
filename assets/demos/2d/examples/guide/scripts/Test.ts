import { _decorator, Component, Input, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component {
  @property
  nodeName: string = "";

  protected onLoad(): void {
    console.log("onLoad: ", this.nodeName);
    this.node.on(Input.EventType.TOUCH_END, () => {
      console.log("click: ", this.nodeName);
    });
  }

  protected onEnable(): void {
    console.log("onEnable: ", this.nodeName);
  }

  protected start(): void {
    console.log("start: ", this.nodeName);
  }

  protected onDisable(): void {
    console.log("onDisable: ", this.nodeName);
  }

  protected onDestroy(): void {
    console.log("onDestroy: ", this.nodeName);
  }
}
