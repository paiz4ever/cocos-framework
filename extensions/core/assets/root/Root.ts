import {
  _decorator,
  Component,
  game,
  Label,
  Node,
  ProgressBar,
  resources,
} from "cc";
import AudioMgr from "../builtin/managers/audio/AudioManager";
import PlatformMgr from "../builtin/managers/platform/PlatformManager";
import { ConfigMgr } from "../builtin/managers";
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
  protected onInitBefore() {
    return Promise.resolve(void 0);
  }
  /** 初始化结束 */
  protected onInitComplete() {
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
      // this.loadingText.string = `游戏加载中(${c}/${this.firstLoadPrefabRes.length})`;
    }
  }

  protected onLoad(): void {
    game.frameRate = 999;
    this.progress = 0;
    this.resCount = 0;
    ConfigMgr.init(this.appConfig)
      .then(() => {
        return this.onInitBefore();
      })
      .then(() => {
        AudioMgr.init();
        return Promise.all([
          /** 初始化平台并登录 */
          PlatformMgr.init().then(PlatformMgr.login),
        ]);
      })
      .then(() => {
        return this.onInitComplete();
      })
      .then(() => {
        this.loadingView?.destroy();
      });
  }

  private async loadRes() {
    // for (let prefabRes of this.firstLoadPrefabRes) {
    //   let { path, bundle } = prefabRes;
    //   await LoadMgr.loadPrefab(bundle, path, (finished, total) => {
    //     this.progress = finished / total;
    //   });
    //   this.resCount++;
    //   if (this.resCount < this.firstLoadPrefabRes.length) {
    //     this.progress = 0;
    //   }
    // }
  }
}
