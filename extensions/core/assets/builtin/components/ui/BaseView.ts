import { _decorator, CCBoolean, Component, Node } from "cc";
import { UIMgr } from "../../../internal/managers";
const { ccclass, property } = _decorator;

@ccclass("BaseView")
export class BaseView<T = any> extends Component {
  @property({ type: CCBoolean, tooltip: "是否自动释放资源" })
  declare autoRelease: boolean;

  protected declare readonly data: T;
  private declare _onShow?: (node: Node, data?: any) => Promise<void>;
  private declare _onHide?: (node: Node) => Promise<void>;
  declare readonly UIID: number;
  attached = false;

  /**
   * 关闭界面
   */
  async hide() {
    await this._hide();
  }

  protected onShow?(): Promise<void> | void {}
  protected onHide?(): Promise<void> | void {}

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

  private async _show() {
    if (this.attached) return;
    this.attached = true;
    await this._onShow?.(this.node, this.data);
    await this.onShow?.();
  }

  private async _hide(options?: {
    release?: boolean;
    onHide?: (node: Node) => Promise<void>;
  }) {
    const { release, onHide } = options || {};
    const isRelease = release ?? this.autoRelease;
    const attached = this.attached;
    this.attached = false;
    // 类似Modal一类带队列的ui，可能此时ui还未挂载，但它存在在UIManager的viewMap中，仍然需要removeBaseView
    if (attached) {
      let hideFunc = onHide === undefined ? this._onHide : onHide;
      await hideFunc?.(this.node);
      await this.onHide?.();
      if (isRelease) {
        this.node?.destroy();
      } else {
        this._recycle();
        this.node?.removeFromParent();
      }
    }
    UIMgr.removeBaseView(this.UIID, this, isRelease);
  }

  private _init(options: {
    id: number;
    data: T;
    onShow?: (node: Node, data?: any) => Promise<void>;
    onHide?: (node: Node) => Promise<void>;
  }) {
    const { id, data, onShow, onHide } = options;
    // @ts-ignore
    this.UIID = id;
    // @ts-ignore
    this.data = data;
    this._onShow = onShow;
    this._onHide = onHide;
  }

  private _recycle() {
    // @ts-ignore
    const prefab = this.node._prefab.asset.data;
    if (prefab) {
      // 复原缓存节点的属性到原始状态
      this.node.setPosition(prefab._lpos);
      this.node.setRotation(prefab._lrot);
      this.node.setScale(prefab._lscale);
    }
  }
}
