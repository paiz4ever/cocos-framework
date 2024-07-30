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
  protected async hide() {
    await this._hide();
    UIMgr.removeBaseView(this.UIID, this);
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
