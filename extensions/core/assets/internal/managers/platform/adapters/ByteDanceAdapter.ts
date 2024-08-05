/**
 * 字节适配器
 */
import BasicAdapter from "./BasicAdapter";
import ConfigMgr from "../../config/ConfigManager";
import StorageMgr from "../../storage/StorageManager";
import LogMgr from "../../log/LogManager";
import EventMgr from "../../event/EventManager";

export default class ByteDanceAdapter
  extends BasicAdapter<"ByteDance">
  implements IPlatform
{
  private gridGamePanel: any;
  private rewardAd: any;
  private rewardAdResolve: (v: unknown) => void;
  private rewardAdReject: (v: unknown) => void;
  private recorder: any;
  private videoPath: string;

  init() {
    return super.init().then(() => {
      this.initRewardAd();
      this.initRecorder();
      this.initGridGamePanel();
      this.checkUpdate();
    });
  }

  onShow(cb: Function) {
    tt.onShow(cb);
  }

  offShow(cb: Function) {
    tt.offShow(cb);
  }

  onHide(cb: Function) {
    tt.onHide(cb);
  }

  offHide(cb: Function) {
    tt.offHide(cb);
  }

  login(): Promise<void> {
    return new Promise((resolve, reject) => {
      const loginFunc = () => {
        if (!this.options?.loginRpc) {
          return reject("ByteDance: loginRpc is required");
        }
        tt.login({
          success: ({ code, anonymousCode }) => {
            this.options
              .loginRpc({
                appID: this.config.appID,
                code,
                anonymousCode,
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
      tt.checkSession({
        success: () => {
          let openID = StorageMgr.get("userAuth")?.uuid;
          if (openID) return resolve(void 0);
          loginFunc();
        },
        fail: loginFunc,
      });
    });
  }

  getUserInfo(): Promise<{ name: string }> {
    return new Promise((resolve, reject) => {
      tt.getUserInfo({
        success({ userInfo }) {
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
    tt.reportAnalytics(evtName, evtData || {});
  }

  getEnv(): TEnv {
    return tt.getEnvInfoSync().microapp.envType === "production"
      ? "production"
      : "development";
  }

  getSystemInfo(): ISystemInfo {
    let sysInfo = tt.getSystemInfoSync();
    let envInfo = tt.getEnvInfoSync();
    return {
      pkg: ConfigMgr.cnf.app.pkg,
      os: sysInfo.platform,
      osVersion: sysInfo.system,
      brand: sysInfo.brand,
      model: sysInfo.model,
      host: sysInfo.appName,
      hostVersion: sysInfo.version,
      appID: this.config.appID,
      appVersion: envInfo.microapp.mpVersion,
    };
  }

  showRewardAd(adScene?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rewardAd
        .show()
        .then(() => {
          EventMgr.emit("rewardAdShowAfter");
          this.rewardAdResolve = resolve;
          this.rewardAdReject = reject;
        })
        .catch(() => {
          return this.rewardAd.load().then(() => {
            return this.rewardAd.show().then(() => {
              EventMgr.emit("rewardAdShowAfter");
              this.rewardAdResolve = resolve;
              this.rewardAdReject = reject;
            });
          });
        })
        .catch(reject);
    });
  }

  share(shareOptions: IShareOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      tt.shareAppMessage({
        title: shareOptions.title,
        desc: shareOptions.desc,
        imageUrl: "",
        query: "",
        success: () => {
          tt.showToast({
            title: "分享成功",
            icon: "success",
          });
          resolve(void 0);
        },
        fail: (err) => {
          tt.showToast({
            title: "分享失败",
            icon: "fail",
          });
          reject(err);
        },
      });
    });
  }

  startRecord() {
    tt.getSystemInfo({
      success: (res) => {
        const screenWidth = res.screenWidth;
        const screenHeight = res.screenHeight;
        var maskInfo = this.recorder.getMark();
        var x = (screenWidth - maskInfo.markWidth) / 2;
        var y = (screenHeight - maskInfo.markHeight) / 2;

        //添加水印并且居中处理
        this.recorder.start({
          duration: 300,
          isMarkOpen: true,
          locLeft: x,
          locTop: y,
        });
      },
    });
  }

  pauseRecord() {
    this.recorder.pause();
  }

  resumeRecord() {
    this.recorder.resume();
  }

  stopRecord() {
    this.recorder.stop();
  }

  shareRecord(shareOptions: IShareOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      tt.shareAppMessage({
        title: shareOptions.title,
        channel: "video",
        extra: {
          videoPath: this.videoPath,
          withVideoId: true,
        },
        success: () => {
          tt.showToast({
            title: "分享成功",
            icon: "success",
          });
          resolve(void 0);
        },
        fail: (err) => {
          tt.showToast({
            title: "分享失败",
            icon: "fail",
          });
          reject(err);
        },
      });
    });
  }

  checkShareRecord(): boolean {
    return !!this.videoPath;
  }

  addDesktop(): Promise<void> {
    return new Promise((resolve, reject) => {
      tt.addShortcut({
        success: resolve,
        fail: reject,
      });
    });
  }

  checkAddDesktop(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      tt.checkShortcut({
        success: ({ status }) => {
          resolve(status.exist);
        },
        fail: reject,
      });
    });
  }

  addFavorite(): Promise<void> {
    return new Promise((resolve, reject) => {
      tt.showFavoriteGuide({
        type: "customize",
        success: resolve,
        fail: reject,
      });
    });
  }

  ttToSideBar(): void {
    tt.navigateToScene({
      scene: "sidebar",
    });
  }

  ttSubscribe(type: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.options?.subscribeRpc) {
        return reject("ByteDance: subscribeRpc is required");
      }
      let { uuid } = StorageMgr.get("userAuth", {});
      if (!uuid) return reject();
      let { subscribeList, appID } = this.config;
      if (!subscribeList || !subscribeList.length) return reject();
      let tplIDs = subscribeList.find((v) => v.type === type)?.tplIDs || [];
      if (!tplIDs.length) return reject();
      tt.requestSubscribeMessage({
        tmplIds: tplIDs,
        success: (res) => {
          let acceptIDs = tplIDs.filter((id) => res[id] === "accept");
          if (!acceptIDs.length) return reject();
          this.options
            .subscribeRpc({
              appID,
              openID: uuid,
              dataList: acceptIDs.map((id) => ({ type, tplID: id, data })),
            })
            .then(() => {
              tt.showToast({
                title: "订阅成功",
                icon: "success",
              });
              resolve(void 0);
            })
            .catch(reject);
        },
        fail: reject,
      });
    });
  }

  ttShowGridGamePanel(): void {
    try {
      this.gridGamePanel?.show();
    } catch (_) {}
  }

  ttHideGridGamePanel(): void {
    try {
      this.gridGamePanel?.hide();
    } catch (_) {}
  }

  private initRewardAd() {
    this.rewardAd = tt.createRewardedVideoAd({
      adUnitId: this.config.rewardAdUnitID,
    });
    this.rewardAd.load();
    this.rewardAd.onClose(({ isEnded }) => {
      if (isEnded) {
        this.rewardAdResolve?.(void 0);
      } else {
        this.rewardAdReject?.(void 0);
      }
      this.rewardAdResolve = null;
      this.rewardAdReject = null;
    });
  }

  private initRecorder() {
    this.recorder = tt.getGameRecorderManager();
    this.recorder.onStop((res) => {
      LogMgr.print("录屏结束");
      this.videoPath = res.videoPath;
    });
    this.recorder.onPause(() => {
      LogMgr.print("录屏暂停");
    });
    this.recorder.onResume(() => {
      LogMgr.print("录屏恢复");
    });
    this.recorder.onStart((res) => {
      LogMgr.print("录屏开始");
    });
    this.recorder.onError((error) => {
      LogMgr.print("录屏出错", error);
    });
  }

  private initGridGamePanel() {
    let info = this.options.getGridGamePanelInfo() || {};
    try {
      const { windowWidth, windowHeight } = tt.getSystemInfoSync();
      this.gridGamePanel = tt.createGridGamePanel({
        gridCount: info.gridCount || "one",
        size: info.size || "medium",
        position: {
          top: windowHeight - (info.bottomOffset || 0),
          left: windowWidth - (info.rightOffset || 0),
        },
      });
    } catch (_) {}
  }

  private checkUpdate() {
    const updateManager = tt.getUpdateManager();
    updateManager.onUpdateReady(() => {
      tt.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启小游戏？",
        success: (res) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });
    updateManager.onUpdateFailed(() => {
      tt.showToast({
        title: "新版本下载失败，请稍后再试",
        icon: "fail",
      });
    });
  }
}
