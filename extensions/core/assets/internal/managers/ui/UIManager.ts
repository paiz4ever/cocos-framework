import { Event, EventTouch, instantiate, Layers, Node, Prefab } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import Root from "../../root/Root";
import ResMgr from "../res/ResManager";
import {
  LayerDev,
  LayerFixed,
  LayerLoading,
  LayerModal,
  LayerToast,
  LayerRoot,
  LayerView,
} from "./layers";
import { LayerBase } from "./layers/base";
import { BaseView } from "../../../builtin/components/ui/BaseView";
import { ArrayMap } from "../../../builtin/structs";

const AllLayers: { [x in TLayer]: new () => Node } = {
  GameView: LayerView,
  Fixed: LayerFixed,
  PopView: LayerView,
  Modal: LayerModal,
  Loading: LayerLoading,
  Toast: LayerToast,
  Dev: LayerDev,
};

class UIManager extends Singleton {
  private declare root: Root;
  private declare layerRoot: LayerRoot;
  private declare layers: Map<TLayer, LayerBase>;
  private declare viewMap: ArrayMap<number, BaseView>;
  declare defaultConfig: {
    Loading?: IUIResource;
    Toast?: IUIResource;
  };
  declare config: IUIConfig;

  get camera() {
    return this.root.camera;
  }

  get canvas() {
    return this.root.canvas;
  }

  init(root: Root) {
    this.root = root;
    this.layerRoot = new LayerRoot();
    this.root.node.addChild(this.layerRoot);
    this.layers = new Map();
    this.viewMap = new ArrayMap();
    Object.keys(AllLayers).forEach((layer: TLayer) => {
      const layerNode = new AllLayers[layer]();
      this.layers.set(layer, layerNode);
      if (layer === "Loading" || layer === "Toast") {
        (layerNode as any).initDefault(this.defaultConfig[layer]);
      }
      this.layerRoot.addChild(layerNode);
    });
  }

  async show(options: {
    id: number;
    data?: any;
    silent?: boolean;
    onShow?: (node: Node, data?: any) => Promise<void>;
    onHide?: (node: Node) => Promise<void>;
  }) {
    const { id, data, silent, onShow } = options;
    const res = this.config?.[id];
    if (!res) {
      throw new Error("invalid ui ID: " + id);
    }
    const { layer, path, bundleName, bundleVersion } = res;
    const layerNode = this.layers.get(layer);
    if (!layerNode) {
      throw new Error("invalid ui layer: " + layer);
    }
    const prefab = await ResMgr.loadPrefab({
      path,
      bundleName,
      bundleVersion,
    });
    const viewNode = instantiate(prefab);
    const bvC = viewNode.getComponent(BaseView);
    if (!bvC) {
      throw new Error("view must have BaseView component");
    }
    bvC.constructor.prototype._inject.call(bvC, options);
    layerNode.addChild(viewNode);
    this.viewMap.add(id, bvC);
    await onShow?.(viewNode, data);
    return viewNode;
  }
  async hide(options: {
    id: number;
    release?: boolean;
    onHide?: (node: Node) => Promise<void>;
  }) {
    const { id } = options;
    const bvCs = this.viewMap.get(id) || [];
    for (let bvC of bvCs) {
      if (!bvC.isValid) continue;
      await bvC.constructor.prototype._hide.call(bvC, options);
    }
    this.viewMap.delete(id);
  }
  async hideAll(options?: { release?: boolean }) {
    const bvCs = this.viewMap.allValues() || [];
    for (let bvC of bvCs) {
      if (!bvC.isValid) continue;
      await bvC.constructor.prototype._hide.call(bvC, options);
    }
    this.viewMap.clear();
  }
  async replace(options: {
    id: number;
    data?: any;
    silent?: boolean;
    onShow?: (node: Node, data?: any) => Promise<void>;
    onHide?: (node: Node) => Promise<void>;
  }) {
    await this.hideAll();
    await this.show(options);
  }
  showToast(options: { msg: string; duration?: number } | string) {
    if (typeof options === "string") {
      options = { msg: options };
    }
    return (this.layers.get("Toast") as LayerToast).add(options);
  }
  hideToast() {
    return (this.layers.get("Toast") as LayerToast).clear();
  }
  showLoading() {
    return (this.layers.get("Loading") as LayerLoading).act();
  }
  hideLoading(uuid?: string) {
    return (this.layers.get("Loading") as LayerLoading).deact(uuid);
  }
  block() {
    return this.layerRoot.block();
  }
  unblock(uuid?: string) {
    return this.layerRoot.unblock(uuid);
  }
  onTouch(callback: (evt: Event) => void) {
    return this.layerRoot.onTouch(callback);
  }
  offTouch(callback: (evt: Event) => void) {
    return this.layerRoot.offTouch(callback);
  }
  isLoading() {
    return (this.layers.get("Loading") as LayerLoading).isLoading;
  }
  removeBaseView(id: number, bvC: BaseView) {
    const bvCs = this.viewMap.get(id) || [];
    const idx = bvCs.indexOf(bvC);
    if (idx >= 0) {
      bvCs.splice(idx, 1);
    }
  }
}

const UIMgr = UIManager.getInstance();
export default UIMgr;
