import { Layout, Node, ScrollView, UITransform, Vec3, tween, v2, v3 } from "cc";

/**
 * 播放排行榜晋升动画
 * @param options.sv ScrollView
 * @param options.fromIndex 起点index
 * @param options.toIndex 终点index
 */
export function playRankPromotion(options: {
  sv: ScrollView;
  fromIndex: number;
  toIndex: number;
}): Promise<void> {
  const { sv, fromIndex, toIndex } = options;
  // 边界判断
  if (
    !sv.content ||
    !sv.content.children[fromIndex] ||
    !sv.content.children[toIndex]
  ) {
    return Promise.reject(`fromIndex or toIndex is invalid`);
  }
  return new Promise((resolve) => {
    // 放置播放过程中玩家手动滚动视口
    sv.touchScrollLock = true;
    // 禁用Layout避免重绘布局
    const layoutC = sv.content!.getComponent(Layout);
    layoutC && (layoutC.enabled = false);
    // 起始滚动视口到起点
    sv.scrollToItem(fromIndex, 0.1);
    // 设置延时开始播放动画
    sv.scheduleOnce(() => {
      const target = sv.content!.children[fromIndex];
      // 提高目标层级
      target.setSiblingIndex(Infinity);
      // 得到起点到终点的所有需要偏移节点
      const others = sv.content!.children.slice(
        Math.min(toIndex, fromIndex),
        Math.max(toIndex, fromIndex)
      );
      const { width: targetWidth, height: targetHeight } =
        target.getComponent(UITransform)!;
      let othersOffsetX = 0,
        othersOffsetY = 0,
        targetOffsetX = 0,
        targetOffsetY = 0;
      // 计算横向或者纵向需要偏移的距离
      if (sv.horizontal) {
        othersOffsetX = targetWidth * Math.sign(fromIndex - toIndex);
        targetOffsetX =
          others[0]
            .getComponent(UITransform)!
            .getOuterDistance(
              others[others.length - 1].getComponent(UITransform)!
            ).x * Math.sign(toIndex - fromIndex);
      } else if (sv.vertical) {
        othersOffsetY = targetHeight * Math.sign(toIndex - fromIndex);
        targetOffsetY =
          others[0]
            .getComponent(UITransform)!
            .getOuterDistance(
              others[others.length - 1].getComponent(UITransform)!
            ).y * Math.sign(fromIndex - toIndex);
      }
      // 1.目标开始缩放 2.随后目标、视图和其他节点开始偏移 3.目标恢复原始大小
      tween(target)
        .to(0.25, {
          scale: target.getScale().multiplyScalar(1.5),
        })
        .call(() => {
          sv.scrollToOffset(v2(targetOffsetX, -targetOffsetY), 1.5, false);
          const othersOffsetVec = v3(othersOffsetX, othersOffsetY);
          others.forEach((node: Node) => {
            tween(node)
              .by(1.5, {
                position: othersOffsetVec,
              })
              .start();
          });
        })
        .by(1.5, {
          position: v3(targetOffsetX, targetOffsetY),
        })
        .to(0.25, {
          scale: Vec3.ONE,
        })
        .call(resolve)
        .start();
    }, 0.5);
  });
}
