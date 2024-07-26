import {
  _decorator,
  Camera,
  Canvas,
  Component,
  director,
  game,
  Label,
  Node,
  profiler,
  ProgressBar,
  resources,
} from "cc";
import AudioMgr from "../managers/audio/AudioManager";
import PlatformMgr from "../managers/platform/PlatformManager";
import { ConfigMgr, UIMgr } from "../managers";
import { ErrorMonitor } from "../../builtin/minitors";
import { DEBUG } from "cc/env";
import app from "../../module";

const { ccclass, property } = _decorator;

export default abstract class Root extends Component {
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

  protected onLoad(): void {
    this.init();
  }

  declare canvas: Canvas;
  declare camera: Camera;

  private async init() {
    try {
      // ===================常规初始化===================
      if (DEBUG) profiler.showStats();
      (app as any).root = this;
      this.canvas = this.getComponent(Canvas);
      this.camera = this.canvas.cameraComponent;
      director.addPersistRootNode(this.node);
      // ===================常规初始化完成===================

      // ===================流程启动===================
      // 初始化错误监听
      ErrorMonitor.init();
      // 初始化音频
      AudioMgr.init();
      // 初始化UI
      UIMgr.init(this);
      // 配置初始化
      await ConfigMgr.init(this.appConfig);
      await Promise.all([
        // 初始化平台并登录
        PlatformMgr.init().then(PlatformMgr.login),
      ]);
      await this.onInitStart();
      await this.onInitEnd();
      // ===================流程启动完成===================
      // this.loadingView?.destroy();
    } catch (error) {
      this.onInitError(error);
    }
  }
}
