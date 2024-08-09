import { _decorator, Component, Label, Node, ProgressBar } from "cc";
import { BaseView } from "./BaseView";
import { UIMgr } from "../../../internal/managers";
const { ccclass, property } = _decorator;

export class LaunchTracker implements ILaunchTracker {
  constructor(private launchComponent: BaseLaunch) {}

  update(finished: number, total: number) {
    this.launchComponent?.constructor.prototype._refresh(finished, total);
  }

  end() {
    // @ts-ignore
    UIMgr.hide("Launch");
  }
}

@ccclass("BaseLaunch")
export class BaseLaunch extends BaseView {
  autoRelease: boolean = true;

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
  set progress(p: number) {
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
    this.onRefresh(finished, total);
  }

  onRefresh(finished: number, total: number) {}
}
