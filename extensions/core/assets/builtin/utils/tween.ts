import { Node, randomRange, tween, Tween, UIOpacity, v3 } from "cc";

export namespace TweenUtil {
  /**
   * 呼吸动画
   * @param options.node 节点
   * @param options.amplitude 幅度（默认：0.1）
   * @param options.frequency 频率 次/秒（默认：1）
   */
  export function runBreathingAction(options: {
    node: Node;
    amplitude?: number;
    frequency?: number;
  }) {
    let { node, amplitude, frequency } = options;
    amplitude = amplitude ?? 0.1;
    frequency = frequency || 1;
    Tween.stopAllByTarget(node);
    const scale = node.getScale();
    const targetScale = scale.clone().add3f(amplitude, amplitude, amplitude);
    return tween(node)
      .to(1 / 2 / frequency, { scale: targetScale })
      .to(1 / 2 / frequency, { scale })
      .union()
      .repeatForever()
      .start();
  }

  /**
   * 手指戳动画
   * @param options.node 手指节点
   * @param options.amplitude 幅度（默认：10）
   * @param options.frequency 频率 次/秒（默认：1）
   */
  export function runStickAction(options: {
    node: Node;
    amplitude?: number;
    frequency?: number;
  }) {
    let { node, amplitude, frequency } = options;
    amplitude = amplitude ?? 10;
    frequency = frequency || 1;
    Tween.stopAllByTarget(node);
    return tween(node)
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

  /**
   * 渐显渐隐动画
   * @param options.node 节点
   * @param options.from 开始值
   * @param options.to 结束值
   * @param options.duration 持续时间（默认：0.5）
   */
  export function runOpacityAction(options: {
    node: Node;
    from: 0 | 255;
    to: 0 | 255;
    duration?: number;
  }) {
    let { node, from, to, duration } = options;
    duration = duration ?? 0.5;
    Tween.stopAllByTarget(node);
    const opacityC = node.setComponent(UIOpacity);
    return new Promise((resolve) => {
      tween(opacityC)
        .set({ opacity: from })
        .to(duration, { opacity: to })
        .call(resolve)
        .start();
    });
  }

  /**
   * 随机移动动画
   * @param options.node 节点
   * @param options.range 移动范围
   */
  export function runRandomMoveAction(options: { node: Node; range: number }) {
    const { node, range } = options;
    function move() {
      tween(node)
        .by(0.15, {
          position: v3(
            randomRange(-range, range),
            randomRange(-range, range),
            0
          ),
        })
        .call(move)
        .start();
    }
    move();
  }

  /**
   * 软弹簧动画
   * @param options.node 节点
   */
  export function runBounceAction(options: { node: Node }) {
    const { node } = options;
    Tween.stopAllByTarget(node);
    let scaleX = node.scale.x;
    let scaleY = node.scale.y;
    return tween(node)
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
