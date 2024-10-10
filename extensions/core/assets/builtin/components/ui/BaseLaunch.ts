import { _decorator, Component, director, Label, Node, ProgressBar } from "cc";
import { BaseView } from "./BaseView";
const { ccclass, property, menu } = _decorator;

/**
 * 启动页基础组件
 * @description 自定义启动页请继承或直接使用此组件
 */
@ccclass("BaseLaunch")
@menu("ui/BaseLaunch")
export class BaseLaunch extends BaseView {
  @property({ type: Label, tooltip: "进度文本（可选）" })
  declare progressLabel?: Label;
  @property({ type: ProgressBar, tooltip: "进度条（可选）" })
  declare progressBar?: ProgressBar;
  @property({ type: Node, tooltip: "进度条上随动点（可选）" })
  declare progressDot?: Node;

  private _progress = 0;
  get progress() {
    return this._progress;
  }
  private set progress(p: number) {
    if (p === 0) {
      this._progress = 0;
    } else {
      this._progress = Math.min(0.999, Math.max(p, this._progress));
    }
    if (this.progressBar) {
      this.progressBar.progress = this._progress;
      this.progressDot?.setPosition(
        -this.progressBar.totalLength / 2 +
          this.progressBar.totalLength * this._progress,
        0,
        0
      );
    }
  }

  private _refresh(finished: number, total: number) {
    this.progress = finished / total;
    this.onRefresh();
  }

  onRefresh() {}
}

export class LaunchTracker implements ILaunchTracker {
  constructor(
    private launchComponent: BaseLaunch,
    private onEnd?: () => void
  ) {}

  update(finished: number, total: number) {
    if (!this.launchComponent) return;
    this.launchComponent.constructor.prototype._refresh.call(
      this.launchComponent,
      finished,
      total
    );
  }

  fake(timeout: number): Promise<void> {
    if (!this.launchComponent) return Promise.resolve(void 0);
    return new Promise((resolve) => {
      let t = 0;
      const target = { uuid: "__LaunchTracker__" };
      director.getScheduler().schedule(
        (dt) => {
          t += dt;
          this.update(t, timeout);
          if (t >= timeout) {
            director.getScheduler().unscheduleAllForTarget(target);
            resolve(void 0);
          }
        },
        target,
        0
      );
    });
  }

  async end() {
    if (!this.launchComponent) return;
    const comp = this.launchComponent;
    this.launchComponent = null;
    await comp.constructor.prototype._hide.call(comp, {
      release: true,
      onHide: null,
    });
    this.onEnd?.();
  }
}
