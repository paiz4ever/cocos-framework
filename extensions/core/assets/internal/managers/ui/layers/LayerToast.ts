import {
  _decorator,
  director,
  instantiate,
  NodePool,
  Prefab,
  Tween,
  tween,
  UIOpacity,
  UITransform,
  Vec3,
  view,
} from "cc";
import { LayerBase } from "./base";
import ResMgr from "../../res/ResManager";
import { BaseToast } from "../../../../builtin/components/ui/BaseToast";
const { ccclass, property } = _decorator;

export default class LayerToast extends LayerBase {
  private declare toastPrefab: Prefab;
  private declare pool: NodePool;
  private squeezeSpeed = 200;

  constructor() {
    super("__LayerToast__");
    this.pool = new NodePool();
    director.getScheduler().scheduleUpdate(this, 0, false);
  }

  initDefault(res: IResource) {
    if (!res) {
      res = {
        path: "InternalToast",
        bundleName: "internal-prefabs",
      };
    }
    ResMgr.loadPrefab(res).then((prefab) => {
      this.toastPrefab = prefab;
    });
  }

  add(options: { msg: string; duration?: number }) {
    const { msg, duration } = options;
    if (!this.toastPrefab) {
      return;
    }
    const toast = this.pool.get() || instantiate(this.toastPrefab);
    const baseToastC = toast.getComponent(BaseToast);
    toast.setPosition(Vec3.ZERO);
    this.addChild(toast);
    baseToastC.init(msg);
    const opacityC = toast.setComponent(UIOpacity, (c) => (c.opacity = 255));
    tween(opacityC)
      .delay(duration || 2)
      .to(0.2, { opacity: 0 })
      .call(() => this.pool.put(toast))
      .start();
  }

  clear() {
    // 注意此处不能直接遍历子节点，否则会被漏掉
    [...this.children].forEach((node) => {
      Tween.stopAllByTarget(node.getComponent(UIOpacity));
      this.pool.put(node);
    });
  }

  update(dt: number) {
    if (!this.children.length) {
      return;
    }
    const children = this.children;
    for (
      let index = children.length - 1, recovery = false;
      index >= 0;
      index--
    ) {
      const zero = index === children.length - 1;
      const curr = children[index];
      // 直接触发回收逻辑
      if (recovery) {
        Tween.stopAllByTarget(curr.getComponent(UIOpacity));
        this.pool.put(curr);
        continue;
      }
      if (zero) {
        const currUT = curr.getComponent(UITransform);
        const lastMaxY = 0 - currUT.height / 2;
        const currMinY = curr.position.y + lastMaxY;
        if (currMinY > lastMaxY) {
          // 存在空隙
          const addLen = Math.max(
            -this.squeezeSpeed * dt * (children.length - index),
            lastMaxY - currMinY
          );
          curr.setPosition(curr.position.add3f(0, addLen, 0));
        }
      } else {
        const last = children[index + 1];
        const currUT = curr.getComponent(UITransform);
        const lastUT = last.getComponent(UITransform);
        const currMinY = curr.position.y - currUT.height / 2 - 6; //6像素的间隔
        const lastMaxY = last.position.y + lastUT.height / 2;
        if (currMinY < lastMaxY) {
          // 存在重叠
          const addLen = Math.min(
            this.squeezeSpeed * dt * (children.length - index - 1),
            lastMaxY - currMinY
          );
          curr.setPosition(curr.position.add3f(0, addLen, 0));
          const winSize = view.getVisibleSize();
          if (currMinY > winSize.height / 2) {
            // 触发回收逻辑
            recovery = true;
            Tween.stopAllByTarget(curr.getComponent(UIOpacity));
            this.pool.put(curr);
          }
        } else if (currMinY > lastMaxY) {
          // 存在空隙
          const addLen = Math.max(
            -this.squeezeSpeed * dt * (children.length - index),
            lastMaxY - currMinY
          );
          curr.setPosition(curr.position.add3f(0, addLen, 0));
        }
      }
    }
  }
}
