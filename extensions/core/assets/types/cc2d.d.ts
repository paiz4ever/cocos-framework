declare module "cc" {
  interface ScrollView {
    /**
     * 禁用触摸滚动（优先级高于autoTouchLock）
     */
    touchLock: boolean;
    /**
     * 自动禁用触摸滚动（指通过api调用滚动时不允许触摸滚动）
     */
    autoTouchLock: boolean;
    /**
     * 滚动到指定的item
     * @param index item对应的索引
     * @param timeInSecond 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated 滚动加速是否衰减，默认为 true。
     */
    scrollToItem(
      index: number,
      timeInSecond?: number,
      attenuated?: boolean
    ): void;
  }
  interface UITransform {
    /**
     * 获取两个节点之间约束的边缘距离
     * @param transform 另一个节点的UITransform
     */
    getOuterDistance(transform: UITransform): Vec2;
  }
}
