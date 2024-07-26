declare const wx: any;
declare const tt: any;
declare const ks: any;

interface IPlatform {
  /**
   * 初始化
   * @param options 注入的自定义处理函数（登陆，订阅等）
   */
  init: (options?: IInjectOptions) => Promise<void>;
  /**
   * 游戏前台监听
   * @param cb 回调函数
   */
  onShow: (cb: Function) => void;
  /**
   * 取消游戏前台监听
   * @param cb 回调函数
   */
  offShow: (cb: Function) => void;
  /**
   * 游戏后台监听
   * @param cb 回调函数
   */
  onHide: (cb: Function) => void;
  /**
   * 取消游戏后台监听
   * @param cb 回调函数
   */
  offHide: (cb: Function) => void;
  /**
   * 登陆
   * @description 后台登陆请求使用init注入loginRpc函数
   */
  login: () => Promise<void>;
  /**
   * 获取用户信息
   */
  getUserInfo: () => Promise<IUserInfo>;
  /**
   * 发送埋点
   * @param evtName 埋点事件名
   * @param evtData 埋点数据
   */
  report: (evtName: string, evtData?: Object) => void;
  /**
   * 获取环境
   */
  getEnv(): TEnv;
  /**
   * 获取系统信息
   */
  getSystemInfo(): ISystemInfo;
  /**
   * 展示激励广告
   * @param adScene 广告场景名
   */
  showRewardAd: (adScene?: string) => Promise<void>;
  /**
   * 分享
   * @param options.title 标题
   * @param options.desc 描述（可选）
   */
  share: (options: IShareOptions) => Promise<void>;
  /**
   * 开始录屏
   */
  startRecord: () => void;
  /**
   * 暂停录屏
   */
  pauseRecord: () => void;
  /**
   * 恢复录屏
   */
  resumeRecord: () => void;
  /**
   * 结束录屏
   */
  stopRecord: () => void;
  /**
   * 分享录屏
   */
  shareRecord: (options: IShareOptions) => Promise<void>;
  /**
   * 检查是否可以分享录屏
   */
  checkShareRecord: () => boolean;
  /**
   * 添加桌面
   */
  addDesktop: () => Promise<void>;
  /**
   * 检查是否添加桌面
   */
  checkAddDesktop: () => Promise<boolean>;
  /**
   * 添加收藏
   */
  addFavorite: () => Promise<void>;

  /** ============== 抖小独有 ================ */
  /**
   * 前往侧边栏
   */
  ttToSideBar: () => void;
  /**
   * 订阅
   * @param type 订阅类型
   * @param data 订阅数据
   * @description 后台订阅请求使用init注入subscribeRpc函数
   */
  ttSubscribe: (type: string, data: any) => Promise<void>;
  /**
   * 展示游戏资源互推
   * @description grid样式定义使用init注入getGridGamePanelInfo函数
   */
  ttShowGridGamePanel: () => void;
  /**
   * 隐藏游戏资源互推
   */
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
