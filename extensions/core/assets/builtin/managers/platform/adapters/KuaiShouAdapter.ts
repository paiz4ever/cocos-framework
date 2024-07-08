/**
 * 快手适配器
 */
import ConfigMgr from "../../config/ConfigManager";
import EventMgr from "../../event/EventManager";
import LogMgr from "../../log/LogManager";
import StorageMgr from "../../storage/StorageManager";
import BasicAdapter from "./BasicAdapter";

export default class KuaiShouAdapter
  extends BasicAdapter<"KuaiShou">
  implements IPlatform
{
  private rewardAd: any;
  private recorder: any;
  private videoID: number;
  private onRecord = false;
  private rewardAdResolve: (v: unknown) => void;
  private rewardAdReject: (v: unknown) => void;

  init() {
    return super.init().then(() => {
      this.initRewardAd();
      this.initRecorder();
    });
  }

  onShow(cb: Function) {
    ks.onShow(cb);
  }

  offShow(cb: Function) {
    ks.offShow(cb);
  }

  onHide(cb: Function) {
    ks.onHide(cb);
  }

  offHide(cb: Function) {
    ks.offHide(cb);
  }

  login(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.options?.loginRpc) {
        return reject("KuaiShou: loginRpc is required");
      }
      const loginFunc = () => {
        ks.login({
          success: ({ code }) => {
            this.options
              .loginRpc({
                appID: this.config.appID,
                code,
              })
              .then(({ openID }) => {
                StorageMgr.set("userAuth", (data) => {
                  return {
                    ...data,
                    uuid: openID,
                  };
                });
                resolve(void 0);
              })
              .catch(reject);
          },
          fail: reject,
        });
      };
      ks.checkSession({
        success: () => {
          let openID = StorageMgr.get("userAuth")?.uuid;
          if (openID) {
            if (!StorageMgr.get("userAuth")?.name) {
            }
            resolve(void 0);
          } else {
            loginFunc();
          }
        },
        fail: loginFunc,
      });
    });
  }

  getUserInfo(): Promise<{ name: string }> {
    return new Promise((resolve, reject) => {
      ks.getUserInfo({
        success: ({ userInfo }) => {
          StorageMgr.set("userAuth", (data) => {
            return {
              ...data,
              name: userInfo.nickName,
            };
          });
          resolve({ name: userInfo.nickName });
        },
        fail: reject,
      });
    });
  }

  getEnv(): TEnv {
    return StorageMgr.get("debugSettings", {}).openKsDev
      ? "development"
      : "production";
  }

  getSystemInfo(): ISystemInfo {
    let sysInfo = ks.getSystemInfoSync();
    return {
      pkg: ConfigMgr.cnf.app.pkg,
      os: sysInfo.platform,
      osVersion: sysInfo.system,
      brand: sysInfo.brand,
      model: sysInfo.model,
      host: sysInfo.host.env,
      hostVersion: sysInfo.host.gameVersion,
      appID: this.config.appID,
      appVersion: sysInfo.version,
    };
  }

  showRewardAd(adScene?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rewardAd
        .show()
        .then(() => {
          EventMgr.emit("RewardAdShowAfter");
          this.rewardAdResolve = resolve;
          this.rewardAdReject = reject;
        })
        .catch(reject);
    });
  }

  share(shareOptions: IShareOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      ks.shareAppMessage({
        success: () => {
          ks.showToast({
            title: "分享成功",
            icon: "success",
          });
          resolve(void 0);
        },
        fail: (err) => {
          ks.showToast({
            title: "分享失败",
            icon: "error",
          });
          reject(err);
        },
      });
    });
  }

  startRecord() {
    this.recorder.start();
  }

  pauseRecord() {
    if (!this.onRecord) return;
    this.recorder.pause();
  }

  resumeRecord() {
    if (!this.onRecord) return;
    this.recorder.resume();
  }

  stopRecord() {
    if (!this.onRecord) return;
    this.recorder.stop();
  }

  shareRecord(shareOptions: IShareOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.recorder.publishVideo({
        video: this.videoID,
        callback: (err) => {
          if (err) {
            ks.showToast({
              title: "分享失败",
              icon: "error",
            });
            reject(err);
          } else {
            ks.showToast({
              title: "分享成功",
              icon: "success",
            });
            resolve(void 0);
          }
        },
      });
    });
  }

  checkShareRecord(): boolean {
    return !!this.videoID;
  }

  addDesktop(): Promise<void> {
    return new Promise((resolve, reject) => {
      ks.addShortcut({
        success: resolve,
        fail: reject,
      });
    });
  }

  checkAddDesktop(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ks.checkShortcut({
        success: ({ installed }) => {
          resolve(installed);
        },
        fail: reject,
      });
    });
  }

  addFavorite(): Promise<void> {
    return new Promise((resolve, reject) => {
      ks.addCommonUse({
        success: resolve,
        fail: reject,
      });
    });
  }

  private initRewardAd() {
    this.rewardAd = ks.createRewardedVideoAd({
      adUnitId: this.config.rewardAdUnitID,
    });
    this.rewardAd.onClose((res) => {
      if (res && res.isEnded) {
        this.rewardAdResolve?.(void 0);
      } else {
        this.rewardAdReject?.(void 0);
      }
      this.rewardAdResolve = null;
      this.rewardAdReject = null;
    });
  }

  private initRecorder() {
    this.recorder = ks.getGameRecorder();
    this.recorder.on("stop", (res) => {
      this.onRecord = false;
      LogMgr.print("录屏结束", res);
      if (res && res.videoID) {
        this.videoID = res.videoID;
      } else {
        this.videoID = null;
      }
    });
    this.recorder.on("pause", () => {
      LogMgr.print("录屏暂停");
    });
    this.recorder.on("resume", () => {
      LogMgr.print("录屏恢复");
    });
    this.recorder.on("start", (res) => {
      this.onRecord = true;
      LogMgr.print("录屏开始");
    });
    this.recorder.on("error", (error) => {
      this.onRecord = false;
      LogMgr.print("录屏出错", error);
    });
    this.recorder.on("abort", () => {
      this.onRecord = false;
      LogMgr.print("废弃已录制视频");
    });
  }
}
