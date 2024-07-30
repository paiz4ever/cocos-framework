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
  Vec3,
  director,
  find,
  instantiate,
} from "cc";
import { GuideComponent } from "./GuideComponent";
import { DEBUG } from "cc/env";
import { FingerComponent } from "./FingerComponent";
import { UILayoutUtil, createMask, OperationUtil } from "builtin/utils";
import { guide, GuideItem } from "table";
import { Singleton } from "builtin/structs";
import app from "app";

class GuideView {
  private declare node: Node;
  private declare finger: Node;
  private declare descBox: Node;
  private declare layer: number;
  private preventSwallow = false;
  private snapshot: Map<
    string,
    {
      c: GuideComponent;
      layer: number;
    }
  > = new Map();
  private declare target?: Node;
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
    UILayoutUtil.alignFullScreen(this.node);
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

  open(reflect: Record<string, GuideComponent>, cnf: GuideItem) {
    this.clean();
    const callback = () => {
      this.over();
    };
    switch (cnf.operation) {
      case guide.EOperation.CLICK:
        this.target = reflect[cnf.target || ""]?.node;
        if (!this.target) {
          this.close();
          return;
        }
        OperationUtil.click({
          node: this.target,
          callback,
        });
        break;
      case guide.EOperation.SLIDE:
        this.target = reflect[cnf.target || ""]?.node;
        if (!this.target) {
          this.close();
          return;
        }
        OperationUtil.slide({
          node: this.target,
          direction: reflect[cnf.target || ""]!.slideDirection,
          callback,
        });
        break;
      case guide.EOperation.CONTACT:
        if (!cnf.target) {
          this.close();
          return;
        }
        const [from, to] = cnf.target.split("|");
        this.target = reflect[from]?.node;
        if (!this.target) {
          this.close();
          return;
        }
        OperationUtil.contact({
          node: this.target,
          target: reflect[to]?.node,
          callback,
        });
        break;
    }
    for (let k in reflect) {
      this.snapshot.set(k, {
        c: reflect[k],
        layer: reflect[k].node.layer,
      });
      reflect[k].node.walk((n) => {
        n.layer = 1 << this.layer;
      });
    }
    this.node.active = true;
    this.finger.getComponent(FingerComponent)!.set(this.target);
    this.onGuide = true;
  }

  close() {
    this.clean();
    this.node.active = false;
    this.onGuide = false;
  }

  private clean() {
    if (!this.snapshot.size) return;
    this.snapshot.forEach((v) => {
      v.c.node.walk((n) => {
        n.layer = v.layer;
      });
    });
    this.target = undefined;
    this.snapshot.clear();
  }

  private initEvent() {
    this.node.on(Input.EventType.TOUCH_START, (e: EventTouch) => {
      if (this.target) {
        this.preventSwallow = this.target
          .getComponent(UITransform)!
          .getBoundingBoxToWorld()
          .contains(e.getUILocation());
      }
      e.preventSwallow = this.preventSwallow;
    });
    this.node.on(Input.EventType.TOUCH_END, (e: EventTouch) => {
      e.preventSwallow = this.preventSwallow;
    });
    this.node.on(Input.EventType.TOUCH_CANCEL, (e: EventTouch) => {
      e.preventSwallow = this.preventSwallow;
    });
    this.node.on(Input.EventType.TOUCH_MOVE, (e: EventTouch) => {
      e.preventSwallow = this.preventSwallow;
    });
  }

  private over() {
    this.clean();
    this.onGuide = false;
    const res = GuideSystem.getInstance().next();
    if (!res) this.node.active = false;
    else this.onGuide = true;
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
      console.warn(
        "GuideSystem init failed because the uiCamera could not be found"
      );
      return;
    }
    this.init = () => {};
    this.guideView = new GuideView({ layer, uiCamera, prefabs });
    reader().then(({ defaultStepID, lastStepID }) => {
      if (!lastStepID) {
        this.stepID = defaultStepID;
      } else {
        const item = app.table.TbGuide.get(lastStepID);
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
    return this.run(true);
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
  run(isTrigger = false) {
    if (!this.canGuide) return false;
    const reflect = Object.create(null);
    const components = director
      .getScene()!
      .getComponentsInChildren(GuideComponent);
    const targets = components.filter(
      (c) =>
        c.guideStepID === this.stepID &&
        (isTrigger || c.autoTrigger) &&
        c.node.activeInHierarchy
    );
    if (!targets.length) return false;
    if (targets.length === 1) {
      reflect[targets[0].guideName] = targets[0];
    } else {
      targets.forEach((target, i) => {
        reflect[target.guideName || `__target${i}__`] = target;
      });
    }
    const item = app.table.TbGuide.get(this.stepID!)!;
    this.guideView.open(reflect, item);
    return true;
  }

  /** 下一步引导 */
  next() {
    const item = app.table.TbGuide.get(this.stepID!);
    if (!item || !item.next) {
      this.stepID = undefined;
      console.warn("Guide is over");
      return false;
    }
    this.stepID = item.next;
    return this.run();
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
if (DEBUG) (window as any).GuideSys = GuideSys;
