import {
  _decorator,
  Button,
  Camera,
  Color,
  Component,
  EventTouch,
  Input,
  Node,
  RenderTexture,
  Sprite,
  UITransform,
  v3,
} from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("SpriteButton")
@requireComponent(Sprite)
export class SpriteButton extends Button {
  private declare sprite: Sprite;

  @property(Sprite)
  declare reflectSprite: Sprite;

  protected onLoad(): void {
    this.node.on(Input.EventType.TOUCH_END, this.handleClick2, this);
    this.sprite = this.getComponent(Sprite)!;
  }

  handleClick(e: EventTouch): void {
    console.log("1111");
  }

  handleClick2(e: EventTouch): void {
    console.log("2222", e.getLocation(), e.getUILocation());
    const position = e.getUILocation();
    const texture = this.sprite.spriteFrame!.texture;
    const localPosition = this.getComponent(UITransform)!.convertToNodeSpaceAR(
      position.v3()
    );
    console.log(localPosition);
    const buffer = RenderTexture.prototype.readPixels.call(
      texture,
      50,
      50,
      1,
      1
    )!;
    console.log(buffer);
    this.reflectSprite.color = new Color(
      buffer[0],
      buffer[1],
      buffer[2],
      buffer[3]
    );
    this.interactable = false;
  }

  // handleClick2(e: EventTouch): void {
  //   console.log("2222", e);
  //   const sp = v3()
  // }
}
