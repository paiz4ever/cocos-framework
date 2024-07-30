import {
  BlockInputEvents,
  EventTouch,
  Input,
  Intersection2D,
  Node,
  UITransform,
  Vec2,
  Vec3,
  tween,
  v3,
} from "cc";
import { DEBUG } from "cc/env";

export namespace OperationUtil {
  /**
   * 滑动操作
   * @param options.node 节点
   * @param options.direction 滑动方向（携带滑动的距离）
   * @param options.callback 滑动完成后的回调
   */
  export function slide(options: {
    node: Node;
    direction: Vec3;
    callback?: () => void;
  }) {
    const { node, direction, callback } = options;
    if (!node) return;
    const that = {};
    const offset = direction.length();
    const dirNormalized = direction.normalize().v2();
    const startPos = new Vec2();
    let isAddBlockInput = false;
    if (!node.getComponent(BlockInputEvents)) {
      isAddBlockInput = true;
      node.addComponent(BlockInputEvents);
    }
    function handle(e: EventTouch) {
      const slideVec = e.getUILocation().subtract(startPos);
      const projection = slideVec.dot(dirNormalized);
      if (projection < 0) return;
      if (projection >= offset) {
        node.targetOff(that);
        if (isAddBlockInput) {
          node.getComponent(BlockInputEvents)?.destroy();
        }
        callback && callback();
      }
    }

    node.on(
      Input.EventType.TOUCH_START,
      (e: EventTouch) => {
        startPos.set(e.getUILocation());
      },
      that
    );
    node.on(
      Input.EventType.TOUCH_MOVE,
      (e: EventTouch) => {
        handle(e);
      },
      that
    );
    node.on(
      Input.EventType.TOUCH_END,
      (e: EventTouch) => {
        handle(e);
      },
      that
    );
    node.on(
      Input.EventType.TOUCH_CANCEL,
      (e: EventTouch) => {
        handle(e);
      },
      that
    );
  }

  /**
   * 拖动操作
   * @param options.node 节点
   * @param options.target 目标节点
   * @param options.callback 拖动完成后的回调（返回true使节点复原）
   * @param options.onStart 拖动开始的回调
   * @param options.onResume 拖动复原的回调
   * @param options.parent 父节点（用作层级调整，在拖动开始时将node父节点设置为该节点）
   * @param options.strict 是否开启严格模式（目标节点需要激活才能触发回调）
   */
  export function drag(options: {
    node: Node;
    target: Node;
    callback: () => boolean | void;
    onStart?: () => void;
    onResume?: () => void;
    parent?: Node;
    strict?: boolean;
  }) {
    const { node, target, onStart, onResume, callback, parent, strict } =
      options;
    if (!node || !target) return;
    const that = {};
    let isAddBlockInput = false;
    let onAnim = false;
    const startPos = new Vec3();
    let idx: number;
    let oldParent = node.parent;
    let isTouch = false;
    if (!node.getComponent(BlockInputEvents)) {
      isAddBlockInput = true;
      node.addComponent(BlockInputEvents);
    }
    node.on(
      Input.EventType.TOUCH_START,
      (e: EventTouch) => {
        if (onAnim) return;
        onStart && onStart();
        startPos.set(node.worldPosition);
        // 每次拖动的时候记录（避免注册操作后层级修改导致idx缓存错误）
        idx = node.getSiblingIndex();
        isTouch = true;
        parent && (node.parent = parent);
        node.setSiblingIndex(Infinity);
        const pos = e.getUILocation();
        node.setWorldPosition(pos.x, pos.y, 0);
      },
      that
    );
    node.on(
      Input.EventType.TOUCH_MOVE,
      (e: EventTouch) => {
        if (!isTouch) return;
        const pos = e.getUILocation();
        node.setWorldPosition(pos.x, pos.y, 0);
      },
      that
    );
    node.on(
      Input.EventType.TOUCH_END,
      () => {
        let flag = true;
        if (
          target &&
          (strict ? target.activeInHierarchy : true) &&
          Intersection2D.rectRect(
            node.getComponent(UITransform).getBoundingBoxToWorld(),
            target.getComponent(UITransform).getBoundingBoxToWorld()
          )
        ) {
          node.targetOff(that);
          if (isAddBlockInput) {
            node.getComponent(BlockInputEvents)?.destroy();
          }
          flag = !!callback();
        }
        if (flag) {
          onAnim = true;
          tween(node)
            .to(0.25, {
              worldPosition: startPos,
            })
            .call(() => {
              onResume && onResume();
              onAnim = false;
              node.parent = oldParent;
              node.setWorldPosition(startPos);
              node.setSiblingIndex(idx);
            })
            .start();
        }
        isTouch = false;
      },
      that
    );
  }

  /**
   * 链接操作
   * @param options.node 节点
   * @param options.target 目标节点
   * @param options.callback 链接完成后的回调
   * @param options.strict 是否开启严格模式（目标节点需要激活才能触发回调）
   */
  export function contact(options: {
    node: Node;
    target: Node;
    callback: () => void;
    strict?: boolean;
  }) {
    const { node, target, callback, strict } = options;
    if (!node || !target) return;
    const that = {};
    let isAddBlockInput = false;
    if (!node.getComponent(BlockInputEvents)) {
      isAddBlockInput = true;
      node.addComponent(BlockInputEvents);
    }
    function handle(e: EventTouch) {
      if (
        target &&
        (strict ? target.activeInHierarchy : true) &&
        target
          .getComponent(UITransform)
          .getBoundingBoxToWorld()
          .contains(e.getUILocation())
      ) {
        node.targetOff(that);
        if (isAddBlockInput) {
          node.getComponent(BlockInputEvents)?.destroy();
        }
        callback && callback();
      }
    }
    node.on(
      Input.EventType.TOUCH_CANCEL,
      (e: EventTouch) => {
        handle(e);
      },
      that
    );
    node.on(
      Input.EventType.TOUCH_END,
      (e: EventTouch) => {
        handle(e);
      },
      that
    );
  }

  /**
   * 点击操作
   * @param options.node 节点
   * @param options.tolerance 误差
   * @param options.callback 点击完成后的回调
   */
  export function click(options: {
    node: Node;
    callback: () => void;
    tolerance?: number;
  }) {
    let { node, tolerance, callback } = options;
    if (!node) return;
    const that = {};
    let isAddBlockInput = false;
    const startPos = new Vec2();
    if (!node.getComponent(BlockInputEvents)) {
      isAddBlockInput = true;
      node.addComponent(BlockInputEvents);
    }
    node.on(
      Input.EventType.TOUCH_START,
      (e: EventTouch) => {
        startPos.set(e.getUILocation());
      },
      that
    );
    node.on(
      Input.EventType.TOUCH_END,
      (e: EventTouch) => {
        const isValid =
          tolerance === undefined
            ? true
            : e.getUILocation().equals(startPos, tolerance ?? 0);
        if (isValid) {
          node.targetOff(that);
          if (isAddBlockInput) {
            node.getComponent(BlockInputEvents)?.destroy();
          }
          callback && callback();
        }
      },
      that
    );
  }
}
if (DEBUG) (window as any)["OperationUtil"] = OperationUtil;
