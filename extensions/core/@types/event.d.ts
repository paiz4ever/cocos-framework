type TInternalEvent = {
  /** 打印 */
  log: string;
  /** 语言切换 */
  languageChanged: TLanguage;
  /** 激励视频展示前 */
  rewardAdShowBefore: void;
  /** 激励视频展示后 */
  rewardAdShowAfter: void;
  /** 激励视频完成 */
  rewardAdCompleted: void;
  /** 关闭激励视频 */
  rewardAdClosed: void;
};

type EventCallback<T> = T extends void
  ? () => void
  : T extends any[]
  ? (...args: T) => void
  : (arg: T) => void;
