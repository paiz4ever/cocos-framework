import { _decorator, Component, EventMouse, Input, Node } from "cc";
import app from "app";
const { ccclass, property } = _decorator;

@ccclass("RedDotScene")
export class RedDotScene extends Component {
  protected onLoad(): void {
    // 根据条件添加红点（注意仅需添加叶子节点）
    app.sys.redDot.add("A|B|B1");
    app.sys.redDot.add("A|B|B2");
    app.sys.redDot.add("A|C");

    // 左键删除红点 右键添加红点
    this.node.children.slice(1).forEach((n) => {
      n.on(Input.EventType.MOUSE_UP, (e: EventMouse) => {
        if (e.getButton() === EventMouse.BUTTON_RIGHT) {
          // 这里为了方便节点名同红点路径一致
          app.sys.redDot.add(n.name);
        } else {
          app.sys.redDot.del(n.name);
        }
      });
    });
  }
}
