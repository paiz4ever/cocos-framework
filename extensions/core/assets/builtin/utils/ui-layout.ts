import { Node, Widget } from "cc";

/** 对齐全屏 */
export function alignFullScreen(
  node: Node,
  alignMode = Widget.AlignMode.ON_WINDOW_RESIZE
) {
  node.setComponent(Widget, (c) => {
    c.alignMode = alignMode;
    c.isAlignBottom = true;
    c.isAlignLeft = true;
    c.isAlignRight = true;
    c.isAlignTop = true;
    c.left = 0;
    c.right = 0;
    c.top = 0;
    c.bottom = 0;
  });
}
