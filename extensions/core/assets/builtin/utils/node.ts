import { BlockInputEvents, Color, Layers, Node, Sprite, Widget } from "cc";
import { alignFullScreen } from "./ui-layout";
import { ResMgr } from "../../internal/managers";

/**
 * 创建遮罩
 * @param options.name 遮罩节点名称
 * @param options.parent 父节点
 * @param options.color 遮罩颜色
 * @param options.layer 层级
 * @return 遮罩节点
 */
export function createMask(options?: {
  name?: string;
  parent?: Node;
  color?: Color;
  layer?: number;
  blockInput?: boolean;
}): Node {
  const mask = new Node(options?.name || "__Mask__");
  alignFullScreen(mask);
  options?.blockInput && mask.addComponent(BlockInputEvents);
  mask.layer = options?.layer ?? Layers.BitMask.UI_2D;
  if (options?.parent) {
    options.parent.addChild(mask);
  }
  ResMgr.loadSpriteFrame({
    bundleName: "textures",
    path: "single-color",
  })
    .then((spriteFrame) => {
      if (!mask.isValid) return;
      mask.setComponent(Sprite, (c) => {
        c.spriteFrame = spriteFrame;
        c.color = options?.color || new Color(0, 0, 0, 127);
      });
      mask.getComponent(Widget).updateAlignment();
    })
    .catch((e) => {
      mask.destroy();
      return Promise.reject(e);
    });
  return mask;
}
