import { _decorator, Component, EventMouse, Input, Node } from "cc";
import RedDotSys from "../../../packages/red-dot";
const { ccclass, property } = _decorator;

@ccclass("RedDot")
export class RedDot extends Component {
  protected onLoad(): void {
    // 根据条件添加红点（注意仅需添加叶子节点）
    RedDotSys.add("A|B|B1");
    RedDotSys.add("A|B|B2");
    RedDotSys.add("A|C");

    // 左键删除红点 右键添加红点
    this.node.children.slice(1).forEach((n) => {
      n.on(Input.EventType.MOUSE_UP, (e: EventMouse) => {
        if (e.getButton() === EventMouse.BUTTON_RIGHT) {
          RedDotSys.add(n.name);
        } else {
          RedDotSys.del(n.name);
        }
      });
    });
  }
}
