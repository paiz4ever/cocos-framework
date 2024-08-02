type TInternalEvent = {
  /** 打印 */
  Log: [string];
  /** 激励视频展示前 */
  BeforeShowRewardAd: [];
  /** 激励视频展示后 */
  AfterShowRewardAd: [];
  /** 激励视频完成 */
  RewardAdCompleted: [];
  /** 关闭激励视频 */
  CloseRewardAd: [];
};
