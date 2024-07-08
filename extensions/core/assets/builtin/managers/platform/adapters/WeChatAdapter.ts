/**
 * 微信适配器
 */
import ConfigMgr from "../../config/ConfigManager";
import EventMgr from "../../event/EventManager";
import LogMgr from "../../log/LogManager";
import StorageMgr from "../../storage/StorageManager";
import BasicAdapter from "./BasicAdapter";

export default class WeChatAdapter
  extends BasicAdapter<"WeChat">
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
      this.checkUpdate();
    });
  }

  onShow(cb: Function) {
    wx.onShow(cb);
  }

  offShow(cb: Function) {
    wx.offShow(cb);
  }

  onHide(cb: Function) {
    wx.onHide(cb);
  }

  offHide(cb: Function) {
    wx.offHide(cb);
  }

  login(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.options?.loginRpc) {
        return reject("WeChat: loginRpc is required");
      }
      const loginFunc = () => {
        wx.login({
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
      wx.checkSession({
        success: () => {
          let openID = StorageMgr.get("userAuth")?.uuid;
          if (openID) {
            if (!StorageMgr.get("userAuth")?.name) {
              wx.getUserInfo({
                success: ({ userInfo }) => {
                  StorageMgr.set("userAuth", (data) => {
                    return {
                      ...data,
                      name: userInfo.nickName,
                    };
                  });
                },
              });
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
      wx.getUserInfo({
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

  report(evtName: string, evtData?: Object): void {
    wx.reportEvent(evtName, evtData || {});
  }

  getEnv(): TEnv {
    return wx.getAccountInfoSync().miniProgram.envVersion === "release"
      ? "production"
      : "development";
  }

  getSystemInfo(): ISystemInfo {
    let sysInfo = wx.getSystemInfoSync();
    let accountInfo = wx.getAccountInfoSync();
    return {
      pkg: ConfigMgr.cnf.app.pkg,
      os: sysInfo.platform,
      osVersion: sysInfo.system,
      brand: sysInfo.brand,
      model: sysInfo.model,
      host: "WeChat",
      hostVersion: sysInfo.version,
      appID: this.config.appID,
      appVersion: accountInfo?.miniProgram?.version || "0.0.0",
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
        .catch(() => {
          return this.rewardAd.load().then(() => {
            return this.rewardAd.show().then(() => {
              EventMgr.emit("RewardAdShowAfter");
              this.rewardAdResolve = resolve;
              this.rewardAdReject = reject;
            });
          });
        })
        .catch(reject);
    });
  }

  share(shareOptions: IShareOptions): Promise<void> {
    wx.shareAppMessage({
      title: shareOptions.title,
    });
    return Promise.resolve(void 0);
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
    wx.operateGameRecorderVideo({
      title: shareOptions.title,
    });
    return Promise.resolve(void 0);
  }

  checkShareRecord(): boolean {
    return !!this.videoID;
  }

  private initRewardAd() {
    this.rewardAd = wx.createRewardedVideoAd({
      adUnitId: this.config.rewardAdUnitID,
    });
    this.rewardAd.load();
    this.rewardAd.onClose((res) => {
      if (res && res.isEnded) {
        this.rewardAdResolve?.(void 0);
      } else {
        this.rewardAdReject?.(void 0);
      }
      this.rewardAdResolve = null;
      this.rewardAdReject = null;
    });
    this.rewardAd.onError(() => {});
  }

  private initRecorder() {
    this.recorder = wx.getGameRecorder();
    this.recorder.on("stop", (res) => {
      this.onRecord = false;
      this.videoID = 1;
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
      this.videoID = null;
    });
    this.recorder.on("abort", () => {
      this.onRecord = false;
      LogMgr.print("废弃已录制视频");
    });
  }

  private checkUpdate() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: "新版本下载失败，请稍后再试",
        icon: "error",
      });
    });
  }
}
