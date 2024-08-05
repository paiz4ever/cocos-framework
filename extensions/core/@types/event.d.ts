type TInternalEvent = {
  /** 打印 */
  log: string;
  /** 语言切换 */
  languageChanged: TLanguage;
  /** 激励视频展示前 */
  rewardAdShowBefore: never;
  /** 激励视频展示后 */
  rewardAdShowAfter: never;
  /** 激励视频完成 */
  rewardAdCompleted: never;
  /** 关闭激励视频 */
  rewardAdClosed: never;
};

type EventCallback<T> = T extends never
  ? () => void
  : T extends any[]
  ? (...args: T) => void
  : (arg: T) => void;
