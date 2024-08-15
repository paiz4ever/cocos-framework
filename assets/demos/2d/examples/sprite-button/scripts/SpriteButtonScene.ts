import { _decorator, Component, EventTouch, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SpriteButtonScene")
export class SpriteButtonScene extends Component {
  @property(Sprite)
  declare referenceSprite: Sprite;

  handle(e: EventTouch) {
    const sprite = e.currentTarget.getComponent(Sprite);
    const color = sprite.hitColor(e);
    this.referenceSprite.color = color;
  }
}
