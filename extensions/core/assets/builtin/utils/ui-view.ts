import {
  BlockInputEvents,
  Color,
  Layers,
  Node,
  Sprite,
  tween,
  UIOpacity,
  UITransform,
  v3,
  Vec3,
  view,
  Widget,
} from "cc";
import { DEBUG } from "cc/env";
import { UILayoutUtil } from "./ui-layout";
import { ResMgr } from "../../internal/managers";

export namespace UIViewUtil {
  const MaxScaleVec = v3(1.2, 1.2, 1.2);
  export namespace show {
    /**
     * 缩放动画
     */
    export function scale(node: Node): Promise<void> {
      return new Promise((resolve) => {
        tween(node)
          .set({ scale: Vec3.ZERO })
          .to(0.15, { scale: MaxScaleVec })
          .to(0.07, { scale: Vec3.ONE })
          .call(resolve)
          .start();
      });
    }

    /**
     * 渐显动画
     */
    export function fade(node: Node): Promise<void> {
      return new Promise((resolve) => {
        const opacityC = node.setComponent(UIOpacity);
        tween(opacityC)
          .set({ opacity: 0 })
          .to(0.5, { opacity: 255 })
          .call(resolve)
          .start();
      });
    }

    /**
     * 滑动动画（从左到右）
     */
    export function slideLTR(node: Node): Promise<void> {
      return slide(node, Direction.LTR);
    }

    /**
     * 滑动动画（从右到左）
     */
    export function slideRTL(node: Node): Promise<void> {
      return slide(node, Direction.RTL);
    }

    /**
     * 滑动动画（从上到下）
     */
    export function slideTTB(node: Node): Promise<void> {
      return slide(node, Direction.TTB);
    }

    /**
     * 滑动动画（从下到上）
     */
    export function slideBTT(node: Node): Promise<void> {
      return slide(node, Direction.BTT);
    }

    enum Direction {
      TTB,
      BTT,
      LTR,
      RTL,
    }
    function slide(node: Node, direction: Direction): Promise<void> {
      const widgetC = node.getComponent(Widget);
      let alignMode: Widget.AlignMode;
      if (widgetC) {
        alignMode = widgetC.alignMode;
        widgetC.alignMode = Widget.AlignMode.ONCE;
        widgetC.updateAlignment();
      }
      const endPosition = node.getWorldPosition();
      let { height: ph, width: pw } = view.getVisibleSize();
      let { height: ch, width: cw } =
        node.getComponent(UITransform).contentSize;
      const startPosition = endPosition.clone();
      if (direction === Direction.TTB) {
        startPosition.y = ph + ch / 2;
      } else if (direction === Direction.BTT) {
        startPosition.y = -ch / 2;
      } else if (direction === Direction.LTR) {
        startPosition.x = -cw / 2;
      } else if (direction === Direction.RTL) {
        startPosition.x = pw + cw / 2;
      }
      node.setTemporaryProperty("$SlideReverseFunc", () => {
        return new Promise((resolve) => {
          tween(node)
            .to(0.25, { worldPosition: startPosition })
            .call(resolve)
            .start();
        });
      });
      return new Promise((resolve) => {
        tween(node)
          .set({ worldPosition: startPosition })
          .to(0.25, { worldPosition: endPosition })
          .call(() => {
            widgetC && (widgetC.alignMode = alignMode);
            resolve(void 0);
          })
          .start();
      });
    }
  }

  export namespace hide {
    /**
     * 缩放动画
     */
    export function scale(node: Node): Promise<void> {
      return new Promise((resolve) => {
        tween(node)
          .to(0.07, { scale: MaxScaleVec })
          .to(0.15, { scale: Vec3.ZERO })
          .call(resolve)
          .start();
      });
    }

    /**
     * 渐显动画
     */
    export function fade(node: Node): Promise<void> {
      return new Promise((resolve) => {
        const opacityC = node.setComponent(UIOpacity);
        tween(opacityC).to(0.22, { opacity: 0 }).call(resolve).start();
      });
    }

    export function slide(node: Node): Promise<void> {
      return node.getTemporaryProperty("$SlideReverseFunc")?.();
    }
  }

  /**
   * 创建阴影遮罩
   * @param options.name 遮罩节点名称
   * @param options.parent 父节点
   * @param options.color 遮罩颜色
   * @param options.layer 层级
   * @param options.preventBlockInput 是否阻止触摸输入
   * @return 遮罩节点
   */
  export function createShade(options?: {
    name?: string;
    parent?: Node;
    color?: Color;
    layer?: number;
    preventBlockInput?: boolean;
  }): Node {
    const shade = new Node(options?.name || "__Shade__");
    UILayoutUtil.alignFullScreen(shade);
    if (!options?.preventBlockInput) {
      shade.addComponent(BlockInputEvents);
    }
    shade.layer = options?.layer ?? Layers.BitMask.UI_2D;
    if (options?.parent) {
      options.parent.addChild(shade);
    }
    ResMgr.loadSpriteFrame({
      bundleName: "internal-textures",
      path: "single-color",
    })
      .then((spriteFrame) => {
        if (!shade.isValid) return;
        shade.setComponent(Sprite, (c) => {
          c.spriteFrame = spriteFrame;
          c.color = options?.color || new Color(0, 0, 0, 127);
        });
        shade.getComponent(Widget).updateAlignment();
      })
      .catch((e) => {
        shade.destroy();
        return Promise.reject(e);
      });
    return shade;
  }
}
if (DEBUG) (window as any)["UIViewUtil"] = UIViewUtil;
