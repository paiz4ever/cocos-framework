import {
  Color,
  Component,
  EventMouse,
  EventTouch,
  RenderTexture,
  Sprite,
  UITransform,
  Vec3,
} from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Sprite.prototype.hitTest = function (arg1: any, arg2?: true) {
    const self = this as Sprite;
    return self.hitColor(arg1, arg2)?.a > 0;
  };

  Sprite.prototype.hitColor = function (arg1: any, arg2?: true) {
    const self = this as Sprite;
    const texture = self.spriteFrame!.original!._texture!;
    if (!texture) {
      return null;
    }
    const uiTransform = self.getComponent(UITransform);
    if (!uiTransform) {
      return null;
    }
    let localPosition: Vec3;
    if (arg1 instanceof EventMouse || arg1 instanceof EventTouch) {
      const { x, y } = arg1.getUILocation();
      localPosition = uiTransform.convertToNodeSpaceAR(new Vec3(x, y, 0));
    } else if (arg2) {
      localPosition = uiTransform.convertToNodeSpaceAR(arg1);
    } else {
      localPosition = arg1.clone();
    }
    localPosition.x /= uiTransform.width / texture.width;
    localPosition.y /= uiTransform.height / texture.height;
    const x = (localPosition.x + texture.width * uiTransform.anchorX) | 0;
    const y =
      (texture.height * (1 - uiTransform.anchorY) - localPosition.y) | 0;
    // 左上角为原点
    const buffer = RenderTexture.prototype.readPixels.call(
      texture,
      x,
      y,
      1,
      1
    )!;
    return new Color(buffer[0], buffer[1], buffer[2], buffer[3]);
  };
}