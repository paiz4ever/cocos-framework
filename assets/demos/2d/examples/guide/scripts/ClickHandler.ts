import { _decorator, Component, EventTouch, Input, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ClickHandler")
export class ClickHandler extends Component {
  @property
  nodeName: string = "";

  protected onLoad(): void {
    (window as any)["node_" + this.nodeName] = this.node;
    this.node.on(
      Input.EventType.TOUCH_START,
      (e: EventTouch) => {
        // e.propagationStopped = this.nodeName === "C";
        console.log("TOUCH_START : ", this.nodeName);
      },
      // true
      this
      // this.nodeName === "C"
      // true
    );
  }

  log() {
    console.log("BUtton", this.nodeName);
  }
}
