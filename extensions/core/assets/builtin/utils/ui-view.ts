import {
  Node,
  tween,
  UIOpacity,
  UITransform,
  v3,
  Vec3,
  view,
  Widget,
} from "cc";
import { DEBUG } from "cc/env";

export namespace UIViewUtil {
  const MaxScaleVec = v3(1.2, 1.2, 1.2);
  export namespace show {
    /**
     * 缩放动画
     */
    export function scale(node: Node) {
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
    export function fade(node: Node) {
      return new Promise((resolve) => {
        const opacityC = node.setComponent(UIOpacity);
        tween(opacityC)
          .set({ opacity: 0 })
          .to(0.22, { opacity: 255 })
          .call(resolve)
          .start();
      });
    }

    /**
     * 滑动动画（从左到右）
     */
    export function slideLTR(node: Node) {
      return slide(node, Direction.LTR);
    }

    /**
     * 滑动动画（从右到左）
     */
    export function slideRTL(node: Node) {
      return slide(node, Direction.RTL);
    }

    /**
     * 滑动动画（从上到下）
     */
    export function slideTTB(node: Node) {
      return slide(node, Direction.TTB);
    }

    /**
     * 滑动动画（从下到上）
     */
    export function slideBTT(node: Node) {
      return slide(node, Direction.BTT);
    }

    enum Direction {
      TTB,
      BTT,
      LTR,
      RTL,
    }
    function slide(node: Node, direction: Direction) {
      const endPosition = node.getWorldPosition();
      const widgetC = node.getComponent(Widget);
      let alignMode: Widget.AlignMode;
      if (widgetC) {
        alignMode = widgetC.alignMode;
        widgetC.alignMode = Widget.AlignMode.ONCE;
        widgetC.updateAlignment();
      }
      let { height: ph, width: pw } = view.getVisibleSize();
      let { height: ch, width: cw } =
        node.getComponent(UITransform).contentSize;
      const startPosition = node.getWorldPosition();
      if (direction === Direction.TTB) {
        startPosition.y = ph + ch / 2;
      } else if (direction === Direction.BTT) {
        startPosition.y = -ch / 2;
      } else if (direction === Direction.LTR) {
        startPosition.x = -cw / 2;
      } else if (direction === Direction.RTL) {
        startPosition.x = pw + cw / 2;
      }
      node.setTempAttr("slideReverseFunc", () => {
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
    export function scale(node: Node) {
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
    export function fade(node: Node) {
      return new Promise((resolve) => {
        const opacityC = node.setComponent(UIOpacity);
        tween(opacityC).to(0.22, { opacity: 0 }).call(resolve).start();
      });
    }

    export function slide(node: Node) {
      return node["slideReverseFunc"]?.();
    }
  }
}
if (DEBUG) (window as any)["UIViewUtil"] = UIViewUtil;
