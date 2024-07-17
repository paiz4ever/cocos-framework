/**
 * 思路：
 * 引导触发（使用位运算 因为条件可以重叠）
 * 1. 延时触发（指定定时结束后触发）
 * 2. 事件触发（emit）
 *
 * 中途退出
 *
 * 使用render texture来处理遮罩高亮
 */

import { Node, director, find } from "cc";
import { ConfigMgr } from "core/builtin/managers";
import Singleton from "core/builtin/structs/abstract/Singleton";
import { alignFullScreen } from "core/builtin/utils/ui-layout";

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
class GuideSystem extends Singleton {
  private views: Map<string, number> = new Map();
  private suppressed = false;
  /** 当前步骤数 */
  step = 0;
  /** 最大步骤数 */
  maxStep = 0;
  /** 是否可以进入引导 */
  get canGuide() {
    return !this.suppressed && this.step < this.maxStep;
  }

  /** 进入下一步引导 */
  next() {
    if (!this.canGuide) return;
    let guideItem = ConfigMgr.tables.TbGuide.get(this.step);
    if (!guideItem) return;
    let node = find(guideItem.targetPath);
    if (!node || !node.active || !node.isValid) return;
    this.active();
  }

  /** 跳过一次引导 */
  skip() {
    this.step++;
    this.deactive();
  }

  /** 重置引导 */
  reset() {
    this.step = 0;
    this.next();
  }

  /** 抑制引导 */
  suppress() {
    this.suppressed = true;
    this.deactive();
  }

  /** 允许引导 */
  permit() {
    this.suppressed = false;
    this.next();
  }

  private registerView(viewName: string) {
    let viewCount = this.views.get(viewName) || 0;
    this.views.set(viewName, viewCount + 1);
    if (!this.canGuide) return;
    this.next();
  }

  private unregisterView(viewName: string) {
    let viewCount = this.views.get(viewName) || 0;
    if (viewCount <= 1) {
      this.views.delete(viewName);
    } else {
      this.views.set(viewName, viewCount - 1);
    }
  }

  private active() {
    const canvas = find("Canvas");
    if (!canvas) return;
    let builtinGuideLayer = canvas.getChildByName("BuiltinGuideLayer");
    if (!builtinGuideLayer) {
      builtinGuideLayer = new Node("BuiltinGuideLayer");
      alignFullScreen(builtinGuideLayer);
      director.getScene()?.addChild(builtinGuideLayer);
      director.addPersistRootNode(builtinGuideLayer);
    }
  }

  private deactive() {}
}

const GuideSys = GuideSystem.getInstance();
export default GuideSys;
