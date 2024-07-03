import { ScrollView, UITransform, v2, warn } from "cc";

/** ScrollView预处理 */
function pretreat(sv: ScrollView) {
  if (sv.touchScrollLock) {
    // @ts-ignore
    sv?._unregisterEvent();
    sv.node.once(ScrollView.EventType.SCROLL_ENDED, () => {
      // @ts-ignore
      sv?._registerEvent();
    });
  }
}

ScrollView.prototype.scrollToItem = function (
  index: number,
  timeInSecond?: number,
  attenuated?: boolean
) {
  const ts = this as ScrollView;
  const node = ts.content?.children[index];
  if (!node) {
    warn(`index ${index} is invalid`);
    return;
  }
  const nodeUITransform = node.getComponent(UITransform)!;
  const viewUITransform = ts.content!.parent!.getComponent(UITransform)!;
  ts.scrollToOffset(
    v2(
      node.position.x +
        nodeUITransform.width * (0.5 - nodeUITransform.anchorX) -
        viewUITransform.width / 2,
      -node.position.y +
        nodeUITransform.height * (nodeUITransform.anchorY - 0.5) -
        viewUITransform.height / 2
    ),
    timeInSecond,
    attenuated
  );
};

const ScrollApis = [
  "scrollToBottom",
  "scrollToTop",
  "scrollToLeft",
  "scrollToRight",
  "scrollToTopLeft",
  "scrollToTopRight",
  "scrollToBottomLeft",
  "scrollToBottomRight",
  "scrollToOffset",
  "scrollToPercentHorizontal",
  "scrollTo",
  "scrollToPercentVertical",
] as const;
ScrollApis.forEach((funcName) => {
  if (typeof ScrollView.prototype[funcName] !== "function") return;
  const oldFunc = ScrollView.prototype[funcName];
  ScrollView.prototype[funcName] = function () {
    pretreat(this);
    // @ts-ignore
    oldFunc.call(this, ...arguments);
  };
});
