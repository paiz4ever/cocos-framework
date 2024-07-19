import { Node, randomRange, tween, Tween, UIOpacity, v3 } from "cc";

export namespace TweenUtil {
  /** 呼吸动画（缩放） */
  export function runBreathingAction(node: Node, duration?: number) {
    Tween.stopAllByTarget(node);
    let scale = node.getScale();
    let targetScale = scale.clone().add3f(0.15, 0.15, 0.15);
    let tw = tween(node)
      .to(duration || 1, { scale: targetScale })
      .to(duration || 1, { scale })
      .union()
      .repeatForever()
      .start();
    return tw;
  }

  /**
   * 手指戳动画
   * @param options.node 手指节点
   * @param options.amplitude 幅度
   * @param options.frequency 频率
   */
  export function runStickAction(options: {
    node: Node;
    amplitude: number;
    frequency: number;
  }) {
    const { node, amplitude, frequency } = options;
    Tween.stopAllByTarget(node);
    tween(node)
      .by(1 / 2 / frequency, {
        worldPosition: v3(amplitude, -amplitude),
      })
      .by(1 / 2 / frequency, {
        worldPosition: v3(-amplitude, amplitude),
      })
      .union()
      .repeatForever()
      .start();
  }

  /** 渐显渐隐动画 */
  export function runOpacityAction(
    node: Node,
    from: 0 | 255,
    to: 0 | 255,
    options?: {
      duration?: number;
    }
  ) {
    Tween.stopAllByTarget(node);
    const opacityC = node.setComponent(UIOpacity);
    return new Promise((resolve) => {
      tween(opacityC)
        .set({ opacity: from })
        .to(options?.duration || 0.5, { opacity: to })
        .call(resolve)
        .start();
    });
  }

  /** 随机移动动画 */
  export function runRandomMoveAction(node: Node, range: number) {
    let startX = node.position.x;
    let startY = node.position.y;
    function move() {
      tween(node)
        .to(0.15, {
          position: v3(
            startX + randomRange(-range, range),
            startY + randomRange(-range, range),
            0
          ),
        })
        .call(move)
        .start();
    }
    move();
  }

  /** 软弹簧动画 */
  export function runBounceAction(node: Node) {
    Tween.stopAllByTarget(node);
    let scaleX = node.scale.x;
    let scaleY = node.scale.y;
    tween(node)
      .to(
        0.15,
        { scale: v3(scaleX * 0.5, scaleY * 1.2, node.scale.z) },
        { easing: "bounceInOut" }
      )
      .to(
        0.15,
        { scale: v3(scaleX * 1.3, scaleY * 0.8, node.scale.z) },
        { easing: "bounceInOut" }
      )
      .to(
        0.2,
        { scale: v3(scaleX * 0.9, scaleY, node.scale.z) },
        { easing: "smooth" }
      )
      .delay(0.7)
      .union()
      .repeatForever()
      .start();
  }
}
