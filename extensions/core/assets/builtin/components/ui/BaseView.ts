import { _decorator, CCBoolean, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BaseView")
export class BaseView extends Component {
  @property({ type: CCBoolean, tooltip: "是否自动释放资源" })
  declare autoRelease: boolean;
}
