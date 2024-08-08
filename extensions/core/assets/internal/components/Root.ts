import {
  _decorator,
  Camera,
  Canvas,
  Component,
  director,
  Game,
  game,
  profiler,
} from "cc";
import AudioMgr from "../managers/audio/AudioManager";
import PlatformMgr from "../managers/platform/PlatformManager";
import { ConfigMgr, ResMgr, UIMgr } from "../managers";
import { ErrorMonitor } from "../monitors";
import { DEBUG } from "cc/env";
import app from "../../module";

const { ccclass, property } = _decorator;

export default abstract class Root extends Component {
  protected abstract appConfig: IAppConfig;

  protected onInitStart() {
    return Promise.resolve(void 0);
  }

  protected onInitEnd() {
    return Promise.resolve(void 0);
  }

  protected onInitError(error: any) {
    return Promise.reject(error);
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
      this.registerEvent();
      // ===================常规初始化完成===================

      // ===================流程启动===================
      // 初始化错误监听
      ErrorMonitor.init();
      // 初始化资源
      await ResMgr.init();
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
    } catch (error) {
      this.onInitError(error);
    }
  }

  private registerEvent() {
    game.on(Game.EVENT_HIDE, () => {
      game.pause();
      AudioMgr.pauseMusic();
      AudioMgr.pauseEffect();
    });
    game.on(Game.EVENT_SHOW, () => {
      game.resume();
      AudioMgr.resumeMusic();
      AudioMgr.resumeEffect();
    });
  }
}
