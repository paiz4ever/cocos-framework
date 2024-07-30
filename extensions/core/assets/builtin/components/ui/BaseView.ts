import { _decorator, CCBoolean, Component, Node } from "cc";
import { UIMgr } from "../../../internal/managers";
const { ccclass, property } = _decorator;

@ccclass("BaseView")
export class BaseView<T = any> extends Component {
  @property({ type: CCBoolean, tooltip: "是否自动释放资源" })
  declare autoRelease: boolean;

  protected declare readonly data: T;
  private declare onHide?: (node: Node) => Promise<void>;
  private declare UIID: number;

  /**
   * 关闭界面
   */
  async hide() {
    await this._hide();
    UIMgr.removeBaseView(this.UIID, this);
  }

  /**
   * 挂载到编辑器EventHandler调用（通常是button）
   * @param funcName data透传过来的函数名
   */
  private async call(_, funcName: string) {
    if (!this.data[funcName] || typeof this.data[funcName] !== "function") {
      console.warn("invalid func: " + funcName);
      return;
    }
    await this.data[funcName]?.(this);
  }

  private async _hide(options?: {
    release?: boolean;
    onHide?: (node: Node) => Promise<void>;
  }) {
    const { release, onHide } = options || {};
    let hideFunc = onHide || this.onHide;
    await hideFunc?.(this.node);
    const isRelease = release || this.autoRelease;
    if (isRelease) {
      this.node?.destroy();
    } else {
      this.node?.removeFromParent();
    }
  }

  private _inject(options: {
    id: number;
    data: T;
    onHide?: (node: Node) => Promise<void>;
  }) {
    const { id, data, onHide } = options;
    this.UIID = id;
    // @ts-ignore
    this.data = data;
    this.onHide = onHide;
  }
}
