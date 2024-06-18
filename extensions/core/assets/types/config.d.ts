type TBuiltinConfig = {
  /** app配置 */
  app: IAppConfig;
  /** 平台配置 */
  platform: IPlatformConfig;
};

interface IAppConfig {
  /** 请求域名 */
  domain: string;
  /** 应用唯一标识 一般为appid */
  appID: string;
  /** 名字 */
  name: string;
  /** 名字缩写 */
  abbr?: string;
  /** 包名 */
  pkg?: string;
}

interface IPlatformConfig {
  /** 抖音 */
  ByteDance?: {
    rewardAdUnitID: string;
    subscribeList: { type: string; tplIDs: string[] }[];
  };
  /** 快手 */
  KuaiShou?: {
    rewardAdUnitID: string;
  };
  /** 微信 */
  WeChat?: {
    rewardAdUnitID: string;
  };
}
