type TInternalEvent = {
  /** 打印 */
  Log: string;
  /** 激励视频展示前 */
  BeforeShowRewardAd: never;
  /** 激励视频展示后 */
  AfterShowRewardAd: never;
  /** 激励视频完成 */
  RewardAdCompleted: never;
  /** 关闭激励视频 */
  CloseRewardAd: never;
};

type EventCallback<T> = T extends never
  ? () => void
  : T extends any[]
  ? (...args: T) => void
  : (arg: T) => void;
