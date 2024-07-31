import { Event, instantiate, Node } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import Root from "../../root/Root";
import ResMgr from "../res/ResManager";
import {
  LayerDev,
  LayerLoading,
  LayerModal,
  LayerToast,
  LayerRoot,
  LayerGame,
  LayerPop,
} from "./layers";
import { LayerBase } from "./layers/base";
import { BaseView } from "../../../builtin/components/ui/BaseView";
import { ArrayMap } from "../../../builtin/structs";

const AllLayers: { [x in TLayer]: new () => LayerBase } = {
  Game: LayerGame,
  Pop: LayerPop,
  Modal: LayerModal,
  Loading: LayerLoading,
  Toast: LayerToast,
  Dev: LayerDev,
};
const LayersOrder: TLayer[] = [
  "Game",
  "Pop",
  "Modal",
  "Loading",
  "Toast",
  "Dev",
];

class UIManager extends Singleton {
  private declare root: Root;
  private declare layerRoot: LayerRoot;
  private declare layers: Map<TLayer, LayerBase>;
  private declare viewMap: ArrayMap<number, BaseView>;
  private declare viewCache: ArrayMap<number, Node>;
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
    this.viewCache = new ArrayMap();
    LayersOrder.forEach((layer: TLayer) => {
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
    onShow?: (node: Node, data?: any) => Promise<void> | void;
    onHide?: (node: Node) => Promise<void> | void;
  }) {
    const { id, silent } = options;
    const res = this.config?.[id];
    if (!res) {
      throw new Error("invalid ui ID: " + id);
    }
    const { layer, path, bundleName, bundleVersion } = res;
    const layerNode = this.layers.get(layer);
    if (!layerNode) {
      throw new Error("invalid ui layer: " + layer);
    }
    let viewNode = this.viewCache.pop(id);
    if (!viewNode) {
      const prefab = await ResMgr.loadPrefab({
        path,
        bundleName,
        bundleVersion,
      });
      prefab.addRef();
      viewNode = instantiate(prefab);
    }
    const bvC = viewNode.getComponent(BaseView);
    if (!bvC) {
      throw new Error("view must have BaseView component");
    }
    bvC.constructor.prototype._init.call(bvC, options);
    this.viewMap.add(id, bvC);
    await layerNode.addView(viewNode);
    return viewNode;
  }

  hide(options: {
    id: number;
    release?: boolean;
    onHide?: (node: Node) => Promise<void> | void;
  }) {
    const { id } = options;
    const layerModal = this.layers.get("Modal") as LayerModal;
    layerModal.queue = layerModal.queue.filter(
      (v) => v.getComponent(BaseView).UIID !== id
    );
    const bvCs = this.viewMap.get(id) || [];
    for (let bvC of bvCs) {
      if (!bvC.isValid) continue;
      bvC.constructor.prototype._hide.call(bvC, options);
    }
  }

  hideAll(options?: { layer?: TUILayer | TUILayer[]; release?: boolean }) {
    let layer = options?.layer;
    const layerModal = this.layers.get("Modal") as LayerModal;
    if (!layer) {
      layerModal.queue = [];
      const bvCs = this.viewMap.allValues() || [];
      for (let bvC of bvCs) {
        if (!bvC.isValid) continue;
        bvC.constructor.prototype._hide.call(bvC, {
          ...options,
          onHide: () => {},
        });
      }
    } else {
      if (!Array.isArray(layer)) {
        layer = [layer];
      }
      for (let l of layer) {
        if (l === "Modal") {
          layerModal.queue = [];
        }
        const layerNode = this.layers.get(l);
        if (!layerNode) continue;
        const bvCs = layerNode.children.map((v) => v.getComponent(BaseView));
        for (let bvC of bvCs) {
          if (!bvC.isValid) continue;
          bvC.constructor.prototype._hide.call(bvC, {
            ...options,
            onHide: () => {},
          });
        }
      }
    }
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

  removeBaseView(id: number, bvC: BaseView, release: boolean) {
    const bvCs = this.viewMap.get(id) || [];
    const idx = bvCs.indexOf(bvC);
    if (idx === -1) {
      return;
    }
    const target = bvCs.splice(idx, 1);
    if (release) {
      // @ts-ignore
      target[0].node._prefab?.asset.decRef();
    } else {
      this.viewCache.add(id, target[0].node);
    }
    if (bvCs.length === 0) {
      this.viewMap.delete(id);
    } else {
      this.viewMap.set(id, bvCs);
    }
  }
}

const UIMgr = UIManager.getInstance();
export default UIMgr;
