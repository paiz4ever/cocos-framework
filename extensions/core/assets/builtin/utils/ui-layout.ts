import { Node, Widget } from "cc";

/** 对齐全屏 */
export function alignFullScreen(
  node: Node,
  alignMode = Widget.AlignMode.ON_WINDOW_RESIZE
) {
  let widgetC = getWidget(node);
  widgetC.alignMode = alignMode;
  widgetC.isAlignBottom = true;
  widgetC.isAlignLeft = true;
  widgetC.isAlignRight = true;
  widgetC.isAlignTop = true;
  widgetC.left = 0;
  widgetC.right = 0;
  widgetC.top = 0;
  widgetC.bottom = 0;
}

/** 获取Widget组件 */
export function getWidget(node: Node) {
  let widgetC = node.getComponent(Widget);
  if (!widgetC) {
    widgetC = node.addComponent(Widget);
  }
  return widgetC;
}
