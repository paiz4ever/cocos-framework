import { _decorator, Component, EventTouch } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SpriteButtonScene")
export class SpriteButtonScene extends Component {
  handleClick(e: EventTouch): void {
    console.log("1111");
  }
}
