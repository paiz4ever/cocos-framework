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

  protected onLoad(): void {
    this.node.on(Input.EventType.TOUCH_START, this._handleClick, this);
    this.node.on(Input.EventType.TOUCH_END, this._handleClick, this);
    this.sprite = this.getComponent(Sprite)!;
  }

  private _handleClick(evt: EventTouch) {
    this.interactable = this.sprite.hitTest(evt);
  }
}
