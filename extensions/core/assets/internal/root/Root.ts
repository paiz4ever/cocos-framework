import {
  _decorator,
  Component,
  game,
  Label,
  Node,
  profiler,
  ProgressBar,
  resources,
} from "cc";
import AudioMgr from "../managers/audio/AudioManager";
import PlatformMgr from "../managers/platform/PlatformManager";
import { ConfigMgr } from "../managers";
import { ErrorMonitor } from "../../builtin/minitors";
import { DEBUG } from "cc/env";

const { ccclass, property } = _decorator;

export default abstract class Root extends Component {
  @property(Node)
  loadingView?: Node;
  @property(Label)
  loadingText?: Label;
  @property(ProgressBar)
  bar?: ProgressBar;
  @property(Node)
  barDot?: Node;

  /** 应用配置 */
  protected abstract appConfig: IAppConfig;
  /** 初始化开始前 */
  protected onInitStart() {
    return Promise.resolve(void 0);
  }
  /** 初始化完成 */
  protected onInitEnd() {
    return Promise.resolve(void 0);
  }
  /** 初始化错误 */
  protected onInitError(error: any) {
    return Promise.resolve(void 0);
  }

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
    this._progress = Math.min(0.999, Math.max(p, this._progress));
    if (this.bar) {
      this.bar.progress = this._progress;
      this.barDot?.setPosition(
        -this.bar.totalLength / 2 + this.bar.totalLength * this._progress,
        0,
        0
      );
    }
  }
  private _resCount = 0;
  get resCount() {
    return this._resCount;
  }
  set resCount(c: number) {
    this._resCount = c;
    if (this.loadingText) {
    }
  }

  protected onLoad(): void {
    this.initRoot();
    this.initProcess();
  }

  private initRoot() {
    if (DEBUG) profiler.showStats();

    game.frameRate = 999;
    this.progress = 0;
    this.resCount = 0;
  }

  private initProcess() {
    // 初始化错误监听
    ErrorMonitor.init();
    // 配置初始化
    ConfigMgr.init(this.appConfig)
      .then(() => this.onInitStart())
      .then(() => {
        // 初始化音频
        AudioMgr.init();
        return Promise.all([
          // 初始化平台并登录
          PlatformMgr.init().then(PlatformMgr.login),
        ]);
      })
      .then(() => this.onInitEnd())
      .then(() => this.loadingView?.destroy())
      .catch((error) => this.onInitError(error));
  }
}
