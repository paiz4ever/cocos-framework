/**
 * 思路：
 * 引导触发（使用位运算 因为条件可以重叠）
 * 1. 延时触发（指定定时结束后触发）
 * 2. 事件触发（emit）
 *
 * 中途退出
 */

import {
  Camera,
  Canvas,
  Color,
  EventTouch,
  Input,
  Layers,
  Node,
  Prefab,
  UITransform,
  director,
  find,
  instantiate,
} from "cc";
import { ConfigMgr } from "core/builtin/managers";
import Singleton from "core/builtin/structs/abstract/Singleton";
import { createMask } from "core/builtin/utils/node";
import { alignFullScreen } from "core/builtin/utils/ui-layout";
import { GuideComponent } from "./GuideComponent";
import { PREVIEW } from "cc/env";
import { FingerComponent } from "./FingerComponent";

export function guidable(viewName: string) {
  return function (target: any) {
    let oldOnEnable = target.prototype.onEnable;
    let oldOnDisable = target.prototype.onDisable;
    target.prototype.onEnable = function () {
      oldOnEnable && oldOnEnable.call(this);
      // @ts-ignore
      GuideMgr.registerView(viewName);
    };
    target.prototype.onDisable = function () {
      oldOnDisable && oldOnDisable.call(this);
      // @ts-ignore
      GuideMgr.unregisterView(viewName);
    };
  };
}

class GuideView {
  private declare node: Node;
  private declare finger: Node;
  private declare descBox: Node;
  private declare layer: number;
  private preventSwallow = false;
  private declare target: {
    node: Node;
    layer: number;
  };
  declare onGuide: boolean;

  constructor(options: {
    layer: number;
    uiCamera: Node;
    prefabs?: {
      finger?: () => Promise<Prefab>;
      descBox?: () => Promise<Prefab>;
    };
  }) {
    const { layer, uiCamera, prefabs } = options;
    this.layer = layer;
    this.node = new Node("__Guide__");
    this.node.active = false;
    this.onGuide = false;
    // 这里不要设置Layers.BitMask.UI_2D，因为该层级依赖于节点层级结构（需要时刻保持guide节点在最顶层）
    // 而引导层由于相机priority高于主相机，所以节点后渲染
    this.node.layer = 1 << this.layer;
    this.initEvent();
    alignFullScreen(this.node);
    const guideCamera = instantiate(uiCamera);
    guideCamera.setComponent(Camera, (c) => {
      c.visibility = 1 << this.layer;
      c.priority += 1;
    });
    this.node.setComponent(Canvas, (c) => {
      c.cameraComponent = guideCamera.getComponent(Camera);
      c.alignCanvasWithScreen = true;
    });
    director.getScene()!.addChild(this.node);
    director.addPersistRootNode(this.node);
    this.node.addChild(guideCamera);
    if (prefabs?.finger) {
      prefabs.finger().then((prefab) => {
        this.finger = instantiate(prefab);
        this.finger.layer = 1 << this.layer;
        this.finger.name = "__GuideFinger__";
        this.finger.setComponent(FingerComponent);
        this.node.addChild(this.finger);
      });
    }
    if (prefabs?.descBox) {
      prefabs.descBox().then((prefab) => {
        this.descBox = instantiate(prefab);
        this.descBox.layer = 1 << this.layer;
        this.descBox.name = "__GuideDescBox__";
        this.descBox.setComponent(GuideComponent);
        this.node.addChild(this.descBox);
      });
    }
    createMask({
      name: "__GuideMask__",
      parent: this.node,
      color: new Color(0, 0, 0, 200),
    });
  }

  open(node: Node) {
    this.clean();
    this.target = {
      node,
      layer: node.layer,
    };
    node.walk((n) => {
      n.layer = 1 << this.layer;
    });
    this.node.active = true;
    this.finger.getComponent(FingerComponent)!.set(node);
    this.onGuide = true;
  }

  close() {
    this.clean();
    this.node.active = false;
    this.onGuide = false;
  }

  private clean() {
    if (!this.target) return;
    const { node, layer } = this.target;
    node.walk((n) => {
      n.layer = layer;
    });
  }

  private initEvent() {
    this.node.on(Input.EventType.TOUCH_START, (e: EventTouch) => {
      if (this.target?.node) {
        this.preventSwallow = this.target.node
          .getComponent(UITransform)!
          .getBoundingBoxToWorld()
          .contains(e.getUILocation());
      }
      e.preventSwallow = this.preventSwallow;
    });
    this.node.on(Input.EventType.TOUCH_END, (e: EventTouch) => {
      e.preventSwallow = this.preventSwallow;
      if (this.preventSwallow) {
        this.clean();
        this.onGuide = false;
        const res = GuideSystem.getInstance().next();
        if (!res) this.node.active = false;
        else this.onGuide = true;
      }
    });
    this.node.on(Input.EventType.TOUCH_CANCEL, (e: EventTouch) => {
      e.preventSwallow = this.preventSwallow;
    });
    this.node.on(Input.EventType.TOUCH_MOVE, (e: EventTouch) => {
      e.preventSwallow = this.preventSwallow;
    });
  }
}

class GuideSystem extends Singleton {
  private static createLayer() {
    for (let i = 0; i <= 19; i++) {
      const layerName = Layers.layerToName(i);
      if (layerName === "GUIDE") return i;
      if (layerName) continue;
      Layers.addLayer("GUIDE", i);
      return i;
    }
    return -1;
  }

  private initialized = false;
  private declare writer: (stepID: number) => Promise<void>;
  private declare guideView: GuideView;
  private views: Map<string, number> = new Map();
  private suppressed = false;
  private declare targetNode: Node;
  /** 是否可以进入引导 */
  private get canGuide() {
    return (
      this.initialized &&
      !this.suppressed &&
      !!this.stepID &&
      !this.guideView.onGuide
    );
  }
  private declare defaultStepID: number;
  /** 当前步骤ID */
  declare stepID: number | undefined;

  /**
   * 初始化
   * @param options.uiCamera 主摄像机节点或者路径
   * @param options.reader 引导步骤读取函数
   * @param options.writer 引导步骤写入函数
   */
  init(options: {
    reader: () => Promise<{
      defaultStepID: number;
      lastStepID: number | undefined;
    }>;
    writer: (stepID: number) => Promise<void>;
    uiCamera?: Node | string;
    prefabs?: {
      finger?: () => Promise<Prefab>;
      descBox?: () => Promise<Prefab>;
    };
  }) {
    let { reader, writer, uiCamera, prefabs } = options;
    const layer = GuideSystem.createLayer();
    if (layer === -1) {
      console.warn(
        "GuideSystem init failed because the layer could not be found"
      );
      return;
    }
    if (!options.uiCamera) {
      uiCamera = "Canvas/Camera";
    }
    if (typeof uiCamera === "string") {
      uiCamera = find(uiCamera) as Node;
    }
    if (!uiCamera) {
      console.warn("GuideSystem init failed because the uiCamera is null");
      return;
    }
    this.init = () => {};
    this.guideView = new GuideView({ layer, uiCamera, prefabs });
    reader().then(({ defaultStepID, lastStepID }) => {
      if (!lastStepID) {
        this.stepID = defaultStepID;
      } else {
        const item = ConfigMgr.tables.TbGuide.get(lastStepID);
        if (!item || !item.next) {
          console.warn("Guide is over");
          return;
        }
        if (item.redirect) this.stepID = item.redirect;
        else this.stepID = item.next;
      }
      this.initialized = true;
      this.defaultStepID = defaultStepID;
      this.writer = writer;
      this.run();
    });
  }

  /** 触发引导 */
  trigger() {
    if (!this.canGuide) return false;
    const components = director
      .getScene()!
      .getComponentsInChildren(GuideComponent);
    const target = components.find((c) => c.guideStepID === this.stepID);
    if (!target) return false;
    return this.run(target);
  }

  /** 重置引导 */
  reset() {
    this.stepID = this.defaultStepID;
    this.run();
  }

  /** 抑制引导 */
  suppress() {
    this.suppressed = true;
    this.guideView.close();
  }

  /** 允许引导 */
  permit() {
    this.suppressed = false;
    this.run();
  }

  /** 开始引导 */
  run(target?: GuideComponent) {
    if (!this.canGuide) return false;
    if (target && target.guideStepID !== this.stepID) return false;
    if (!target) {
      const components = director
        .getScene()!
        .getComponentsInChildren(GuideComponent);
      target = components.find((c) => c.guideStepID === this.stepID);
      if (!target || !target.autoTrigger) return false;
    }
    if (!target.node.activeInHierarchy) {
      return false;
    }
    this.guideView.open(target.node);
    return true;
  }

  /** 下一步引导 */
  next() {
    const item = ConfigMgr.tables.TbGuide.get(this.stepID!);
    if (!item || !item.next) {
      this.stepID = undefined;
      console.warn("Guide is over");
      return false;
    }
    this.stepID = item.next;
    return this.run();
  }

  private registerView(viewName: string) {
    let viewCount = this.views.get(viewName) || 0;
    this.views.set(viewName, viewCount + 1);
    this.run();
  }

  private unregisterView(viewName: string) {
    let viewCount = this.views.get(viewName) || 0;
    if (viewCount <= 1) {
      this.views.delete(viewName);
    } else {
      this.views.set(viewName, viewCount - 1);
    }
  }
}

interface IGuideSystem {
  init(options: {
    reader: () => Promise<{
      defaultStepID: number;
      lastStepID: number | undefined;
    }>;
    writer: (stepID: number) => Promise<void>;
    uiCamera?: Node | string;
    prefabs?: {
      finger?: () => Promise<Prefab>;
      descBox?: () => Promise<Prefab>;
    };
  }): void;
  trigger(): boolean;
  reset(): void;
  suppress(): void;
  permit(): void;
}
const GuideSys: IGuideSystem = GuideSystem.getInstance();
export default GuideSys;
if (PREVIEW) (window as any).GuideSys = GuideSys;
