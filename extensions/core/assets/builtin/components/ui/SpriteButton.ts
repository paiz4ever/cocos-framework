import {
  _decorator,
  Button,
  Component,
  EventTouch,
  Input,
  Node,
  RenderTexture,
  Sprite,
  UITransform,
} from "cc";
const { ccclass, property, menu, requireComponent } = _decorator;

/**
 * 图片点击组件
 * @description 提供像素级判定点击是否命中图片
 */
@ccclass("SpriteButton")
@menu("ui/SpriteButton")
@requireComponent([Sprite, UITransform])
export class SpriteButton extends Button {
  private declare sprite: Sprite;
  private declare uiTransform: UITransform;

  protected onLoad(): void {
    this.node.on(Input.EventType.TOUCH_START, this._handleClick, this);
    this.node.on(Input.EventType.TOUCH_END, this._handleClick, this);
    this.sprite = this.getComponent(Sprite)!;
    this.uiTransform = this.getComponent(UITransform)!;
  }

  private _handleClick(evt: EventTouch) {
    const position = evt.getUILocation();
    const texture = this.sprite.spriteFrame!.texture;
    const localPosition = this.uiTransform.convertToNodeSpaceAR(position.v3());
    // 左上角为原点
    const buffer = RenderTexture.prototype.readPixels.call(
      texture,
      localPosition.x +
        this.uiTransform.contentSize.width * this.uiTransform.anchorX,
      this.uiTransform.contentSize.height * (1 - this.uiTransform.anchorY) -
        localPosition.y,
      1,
      1
    )!;
    if (!buffer?.[3]) {
      this.interactable = false;
    } else {
      this.interactable = true;
    }
  }
}
