export function guidable(viewName: string) {
  return function (target: any) {
    let oldOnEnable = target.prototype.onEnable;
    let oldOnDisable = target.prototype.onDisable;
    target.prototype.onEnable = function () {
      oldOnEnable && oldOnEnable.call(this);
      // @ts-ignore
      GuideSys.registerView(viewName);
    };
    target.prototype.onDisable = function () {
      oldOnDisable && oldOnDisable.call(this);
      // @ts-ignore
      GuideSys.unregisterView(viewName);
    };
  };
}
class GuideSystem {
  private static _instance: GuideSystem;
  static getInstance() {
    if (!this._instance) {
      this._instance = new GuideSystem();
    }
    return this._instance;
  }
  private views: Map<string, number> = new Map();
  private registerView(viewName: string) {
    let viewCount = this.views.get(viewName) || 0;
    this.views.set(viewName, viewCount + 1);
  }
  private unregisterView(viewName: string) {
    let viewCount = this.views.get(viewName) || 0;
    if (viewCount <= 1) {
      this.views.delete(viewName);
    } else {
      this.views.set(viewName, viewCount - 1);
    }
  }

  /** 初始化 */
  init() {}

  /** 当前步骤数 */
  get step() {
    return 0;
  }

  /** 最大步骤数 */
  get maxStep() {
    return 0;
  }

  /** 进入下一步引导 */
  next() {}

  /** 跳过一次引导 */
  skip() {}

  /** 重置引导 */
  reset() {}

  /** 抑制引导 */
  suppress() {}

  /** 允许引导 */
  permit() {}
}

export const GuideSys = GuideSystem.getInstance();
