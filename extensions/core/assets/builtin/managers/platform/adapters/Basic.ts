/**
 * 平台基类
 */
import { BUILD } from "cc/env";
import Singleton from "../../../structs/abstract/Singleton";
import { isByteDance, isKuaishou, isWeChat } from "../../../../utils/platform";
import ConfigMgr from "../../config/ConfigManager";

export default class BasicAdapter<T extends keyof IPlatformConfig>
  extends Singleton
  implements IPlatform
{
  private platformName: T = isWeChat()
    ? "WeChat"
    : isByteDance()
    ? "ByteDance"
    : isKuaishou()
    ? "KuaiShou"
    : (undefined as any);
  private injectOptions: IInjectOptions;
  protected get config(): IPlatformConfig[T] {
    if (!this.platformName) return undefined;
    return ConfigMgr.cnf.platform[this.platformName];
  }
  protected get options() {
    return this.injectOptions[this.platformName];
  }

  inject(options: IInjectOptions) {
    this.injectOptions = options;
  }

  init() {
    // 执行初始化流程
    // ...
    return Promise.resolve(void 0);
  }
  onShow(cb: Function) {}
  onHide(cb: Function) {}
  offShow(cb: Function) {}
  offHide(cb: Function) {}
  login() {
    return Promise.resolve(void 0);
  }
  getUserInfo() {
    return Promise.resolve({ name: "" });
  }
  report(evtName: string, evtData?: Object) {}
  getEnv(): TEnv {
    return BUILD ? "production" : "development";
  }
  getSystemInfo(): ISystemInfo {
    return {};
  }
  showRewardAd() {
    return Promise.resolve(void 0);
  }
  share(shareOptions: IShareOptions) {
    return Promise.resolve(void 0);
  }
  startRecord() {}
  pauseRecord() {}
  resumeRecord() {}
  stopRecord() {}
  shareRecord(shareOptions: IShareOptions) {
    return Promise.resolve(void 0);
  }
  checkShareRecord() {
    return true;
  }
  addDesktop() {
    return Promise.resolve(void 0);
  }
  checkAddDesktop() {
    return Promise.resolve(true);
  }
  addFavorite() {
    return Promise.resolve(void 0);
  }
  /** ============== 抖小独有 ================ */
  ttToSideBar() {}
  ttSubscribe(type: string, data: any) {
    return Promise.resolve(void 0);
  }
  ttShowGridGamePanel() {}
  ttHideGridGamePanel() {}
}
