/**
 * 基础适配器
 */
import { BUILD } from "cc/env";
import Singleton from "../../../structs/abstract/Singleton";
import { getPlatformName } from "../../../utils/platform";
import ConfigMgr from "../../config/ConfigManager";

export default class BasicAdapter<T extends keyof IAppConfig["platform"]>
  extends Singleton
  implements IPlatform
{
  private platformName = getPlatformName() as T;
  private injectOptions: IInjectOptions;
  protected get config(): IAppConfig["platform"][T] {
    if (!this.platformName) return undefined;
    return ConfigMgr.cnf.app?.platform?.[this.platformName];
  }
  protected get options(): IInjectOptions[T] {
    return this.injectOptions?.[this.platformName] || {};
  }

  init(options?: IInjectOptions) {
    this.injectOptions = options;
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
