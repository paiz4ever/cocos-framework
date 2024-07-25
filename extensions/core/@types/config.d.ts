type TBuiltinConfig = {
  /** app配置 */
  app: IAppConfig;
};

interface IAppConfig {
  /** 名字 */
  name?: string;
  /** 名字缩写 */
  abbr?: string;
  /** 请求域名 */
  domain?: {
    prod: string;
    dev: string;
  };
  /** 包名 */
  pkg?: string;
  /** 平台配置 */
  platform?: {
    /** 抖音 */
    ByteDance?: {
      /** 应用ID */
      appID: string;
      rewardAdUnitID: string;
      subscribeList?: { type: string; tplIDs: string[] }[];
    };
    /** 快手 */
    KuaiShou?: {
      /** 应用ID */
      appID: string;
      rewardAdUnitID: string;
    };
    /** 微信 */
    WeChat?: {
      /** 应用ID */
      appID: string;
      rewardAdUnitID: string;
    };
  };
}
