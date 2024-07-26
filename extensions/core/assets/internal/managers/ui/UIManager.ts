import { Node } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import Root from "../../root/Root";

const Layers: TLayer[] = [
  "GameView",
  "Fixed",
  "PopView",
  "Modal",
  "Loading",
  "Toast",
  "Touch",
  "Dev",
];

class UIManager extends Singleton {
  private declare root: Root;
  private declare layers: Map<TLayer, Node>;
  declare config: IUIConfig;

  get camera() {
    return this.root.camera;
  }

  get canvas() {
    return this.root.canvas;
  }

  init(root: Root) {
    this.root = root;
    Layers.forEach((layer) => {});
  }

  show(options: IUIShowOptions) {}
  hide(options: IUIHideOptions) {}
  hideAll(options?: { release?: boolean }) {}
  replace(options: IUIShowOptions) {}
  showToast(options: { msg: string; duration?: number }) {}
  hideToast() {}
  showLoading(options?: { msg?: string }) {}
  hideLoading() {}
  block() {}
  unblock() {}
  isShowing() {}
  isLoading() {}
}

const UIMgr = UIManager.getInstance();
export default UIMgr;
