type TInternalStorage = {
  /** 调试模式开启 */
  onDebug: boolean;
  /** 调试设置 */
  debugSettings: {
    offGlobalAd?: boolean;
    openKsDev?: boolean;
  };
  /** 安装时间 */
  installTime: number;
  /** 设置 */
  userSettings: {
    musicOff?: boolean;
    effectOff?: boolean;
  };
  /** 用户信息 */
  userAuth: {
    uuid?: string;
    name?: string;
  };
};

type DayExpire<T> = { data: T; day: number };
type WeekExpire<T> = { data: T; week: number };
