import {
  Color,
  EventMouse,
  EventTouch,
  Sprite,
  Texture2D,
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
    const texture = self.spriteFrame?.texture as Texture2D;
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
    const rect = self.spriteFrame.rect;
    // 找到相对于图片本身左上角的位置
    localPosition.x /= uiTransform.width / rect.width;
    localPosition.y /= uiTransform.height / rect.height;
    // 找到相对图集（有的话，没有rect的x、y为0）中的位置
    const x =
      (rect.x + (localPosition.x + rect.width * uiTransform.anchorX)) | 0;
    const y =
      (rect.y + (rect.height * (1 - uiTransform.anchorY) - localPosition.y)) |
      0;
    const buffer = texture.readPixels(x, y, 1, 1)!;
    return new Color(buffer[0], buffer[1], buffer[2], buffer[3]);
  };
}
