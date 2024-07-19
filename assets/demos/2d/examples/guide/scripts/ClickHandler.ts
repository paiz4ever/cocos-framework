import { _decorator, Component, EventTouch, Input, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ClickHandler")
export class ClickHandler extends Component {
  @property
  nodeName: string = "";

  protected onLoad(): void {
    (window as any)["node_" + this.nodeName] = this.node;
    this.node.on(Input.EventType.TOUCH_START, (e: EventTouch) => {
      console.log("TOUCH_START : ", this.nodeName);
    });
    this.node.on(Input.EventType.TOUCH_END, (e: EventTouch) => {
      console.log("TOUCH_END : ", this.nodeName);
    });
    this.node.on(Input.EventType.TOUCH_MOVE, (e: EventTouch) => {
      console.log("TOUCH_MOVE : ", this.nodeName);
    });
  }
}
