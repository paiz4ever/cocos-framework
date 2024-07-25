declare const wx: any;
declare const tt: any;
declare const ks: any;

interface IPlatform {
  /** 初始化 */
  init: (options?: IInjectOptions) => Promise<void>;
  /** 生命周期-前台 监听 */
  onShow: (cb: Function) => void;
  /** 生命周期-前台 取消监听 */
  offShow: (cb: Function) => void;
  /** 生命周期-后台｜销毁 监听 */
  onHide: (cb: Function) => void;
  /** 生命周期-后台｜销毁 取消监听*/
  offHide: (cb: Function) => void;
  /** 登陆 */
  login: () => Promise<void>;
  /** 获取用户信息 */
  getUserInfo: () => Promise<IUserInfo>;
  /** 上报 */
  report: (evtName: string, evtData?: Object) => void;
  /** 获取环境 */
  getEnv(): TEnv;
  /** 获取系统信息 */
  getSystemInfo(): ISystemInfo;
  /** 展示激励广告 */
  showRewardAd: (adScene?: string) => Promise<void>;
  /** 分享 */
  share: (options: IShareOptions) => Promise<void>;
  /** 开始录屏 */
  startRecord: () => void;
  /** 暂停录屏 */
  pauseRecord: () => void;
  /** 恢复录屏 */
  resumeRecord: () => void;
  /** 结束录屏 */
  stopRecord: () => void;
  /** 分享录屏 */
  shareRecord: (options: IShareOptions) => Promise<void>;
  /** 检查是否可以分享录屏 */
  checkShareRecord: () => boolean;
  /** 添加桌面 */
  addDesktop: () => Promise<void>;
  /** 检查是否添加桌面 */
  checkAddDesktop: () => Promise<boolean>;
  /** 添加喜欢 */
  addFavorite: () => Promise<void>;

  /** ============== 抖小独有 ================ */
  /** 前往侧边栏 */
  ttToSideBar: () => void;
  /** 订阅 */
  ttSubscribe: (type: string, data: any) => Promise<void>;
  /** 展示游戏资源互推 */
  ttShowGridGamePanel: () => void;
  /** 游戏资源互推 */
  ttHideGridGamePanel: () => void;
}

type TEnv = "production" | "development";
interface IInjectOptions {
  ByteDance?: {
    loginRpc?: (data: {
      appID: string;
      code: string;
      anonymousCode: string;
    }) => Promise<{ openID: string }>;
    subscribeRpc?: (data: {
      appID: string;
      openID: string;
      dataList: { type: string; tplID: string; data: any }[];
    }) => Promise<void>;
    getGridGamePanelInfo?: () => {
      bottomOffset?: number;
      rightOffset?: number;
      size?: "small" | "medium" | "large";
      gridCount?: "one" | "four" | "nine";
    };
  };
  WeChat?: {
    loginRpc?: (data: {
      appID: string;
      code: string;
    }) => Promise<{ openID: string }>;
  };
  KuaiShou?: {
    loginRpc?: (data: {
      appID: string;
      code: string;
    }) => Promise<{ openID: string }>;
  };
}
interface IUserInfo {
  name: string;
}
interface ISystemInfo {
  /** 包名 */
  pkg?: string;
  /** 操作系统 */
  os?: string;
  /** 操作系统版本 */
  osVersion?: string;
  /** 品牌 */
  brand?: string;
  /** 型号 */
  model?: string;
  /** 宿主 */
  host?: string;
  /** 宿主版本 */
  hostVersion?: string;
  /** appID */
  appID?: string;
  /** app版本 */
  appVersion?: string;
}
interface IShareOptions {
  /** 分享标题 */
  title: string;
  /** 分享描述 */
  desc?: string;
}
