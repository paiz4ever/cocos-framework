/**
 * UI管理器
 */
import { AssetManager, Event, instantiate, Node, Prefab } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import Root from "../../components/Root";
import ResMgr from "../res/ResManager";
import {
  LayerDev,
  LayerLoading,
  LayerModal,
  LayerToast,
  LayerRoot,
  LayerScene,
  LayerPop,
  LayerLaunch,
} from "./layers";
import { LayerBase } from "./layers/base";
import { BaseView } from "../../../builtin/components/ui/BaseView";
import { ArrayMap } from "../../../builtin/structs";
import {
  BaseLaunch,
  LaunchTracker,
} from "../../../builtin/components/ui/BaseLaunch";

const AllLayers: { [x in TLayer]: new () => LayerBase } = {
  Scene: LayerScene,
  Pop: LayerPop,
  Modal: LayerModal,
  Launch: LayerLaunch,
  Loading: LayerLoading,
  Toast: LayerToast,
  Dev: LayerDev,
};
const LayersOrder: TLayer[] = [
  "Scene",
  "Pop",
  "Modal",
  "Loading",
  "Toast",
  "Dev",
];
const UILayersOrder: TUILayer[] = ["Scene", "Pop", "Modal"];

const MAX_CACHE_SIZE = 25; // 缓存的最大阈值
const LRU_DELETE_COUNT = 10; // 到达最大阈值后用 LRU 算法删除的个数

class UIManager extends Singleton {
  private declare gameRoot: Root;
  private declare layerRoot: LayerRoot;
  private declare layers: Map<TLayer, LayerBase>;
  private declare viewMap: ArrayMap<number, BaseView>;
  private declare viewCache: ArrayMap<number, Node>;
  declare defaultConfig: IUIDefaultConfig;
  declare config: IUIConfig;

  get camera() {
    return this.gameRoot.camera;
  }

  get canvas() {
    return this.gameRoot.canvas;
  }

  get root() {
    return this.layerRoot;
  }

  get isLoading() {
    return (this.layers.get("Loading") as LayerLoading).isLoading;
  }

  init(root: Root) {
    this.gameRoot = root;
    this.layerRoot = new LayerRoot();
    this.gameRoot.node.addChild(this.layerRoot);
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
    return this.showLaunch();
  }

  async show(
    options:
      | {
          id: number;
          data?: any;
          onShow?: (node: Node, data?: any) => Promise<void> | void;
          onHide?: (node: Node) => Promise<void> | void;
          onProgress?: (
            finished: number,
            total: number,
            item: AssetManager.RequestItem
          ) => void;
        }
      | number
  ) {
    if (typeof options !== "object") {
      options = { id: options };
    }
    const { id, onProgress } = options;
    const res = this.config?.[id];
    if (!res) {
      throw new Error("invalid ui ID: " + id);
    }
    const { layer, path, bundleName, bundleVersion } = res;
    const layerNode = this.layers.get(layer);
    if (!layerNode) {
      throw new Error("invalid ui layer: " + layer);
    }
    const blockID = this.block();
    let viewNode = this.viewCache.pop(id);
    if (!viewNode) {
      const prefab = await ResMgr.loadPrefab({
        path,
        bundleName,
        bundleVersion,
        onProgress,
      });
      prefab.addRef();
      viewNode = instantiate(prefab);
    }
    const bvC = viewNode.getComponent(BaseView);
    if (!bvC) {
      throw new Error("view must have BaseView component");
    }
    bvC.constructor.prototype._init.call(bvC, options);
    this.viewMap.setValue(id, bvC);
    await layerNode.addView(viewNode);
    this.unblock(blockID);
    return viewNode;
  }

  hide(
    options:
      | {
          id: number;
          release?: boolean;
          onHide?: (node: Node) => Promise<void> | void;
        }
      | number
  ) {
    if (typeof options === "number") {
      options = { id: options };
    }
    const { id } = options;
    const layerModal = this.layers.get("Modal") as LayerModal;
    layerModal.queue = layerModal.queue.filter(
      // @ts-ignore
      (v) => v.getComponent(BaseView).UIID !== id
    );
    const bvCs = this.viewMap.get(id)?.slice() || [];
    for (let bvC of bvCs) {
      if (!bvC?.isValid) continue;
      bvC.constructor.prototype._hide.call(bvC, options);
    }
  }

  hideAll(options?: {
    layer?: TUILayer | TUILayer[];
    release?: boolean;
    _filter?: BaseView[];
  }) {
    let layer = options?.layer;
    const layerModal = this.layers.get("Modal") as LayerModal;
    if (!layer) {
      layerModal.queue = layerModal.queue.filter((v) =>
        options?._filter?.includes(v.getComponent(BaseView))
      );
      const bvCs = this.viewMap.allValues() || [];
      for (let bvC of bvCs) {
        if (!bvC?.isValid) continue;
        bvC.constructor.prototype._hide.call(bvC, {
          ...options,
          onHide: null,
        });
      }
    } else {
      if (!Array.isArray(layer)) {
        layer = [layer];
      }
      for (let l of layer) {
        if (l === "Modal") {
          layerModal.queue = layerModal.queue.filter((v) =>
            options?._filter?.includes(v.getComponent(BaseView))
          );
        }
        const layerNode = this.layers.get(l);
        if (!layerNode) continue;
        const bvCs = layerNode.children
          .map((v) => v.getComponent(BaseView))
          .filter((v) => !!v && !options?._filter?.includes(v));
        for (let bvC of bvCs) {
          if (!bvC?.isValid) continue;
          bvC.constructor.prototype._hide.call(bvC, {
            ...options,
            onHide: null,
          });
        }
      }
    }
  }

  async replace(
    options:
      | {
          id: number;
          data?: any;
          onShow?: (node: Node, data?: any) => Promise<void> | void;
          onHide?: (node: Node) => Promise<void> | void;
          onProgress?: (
            finished: number,
            total: number,
            item: AssetManager.RequestItem
          ) => void;
        }
      | number
  ) {
    if (typeof options !== "object") {
      options = { id: options };
    }
    const { id, onProgress } = options;
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
        onProgress,
      });
      prefab.addRef();
      viewNode = instantiate(prefab);
    }
    const bvC = viewNode.getComponent(BaseView);
    if (!bvC) {
      throw new Error("view must have BaseView component");
    }
    const bottomLayer: TUILayer[] = [];
    const topLayer: TUILayer[] = [];
    let list = bottomLayer;
    for (let l of UILayersOrder) {
      list.push(l);
      if (l === layer) {
        list = topLayer;
      }
    }
    topLayer.length && this.hideAll({ layer: topLayer });
    bvC.constructor.prototype._init.call(bvC, options);
    this.viewMap.setValue(id, bvC);
    await layerNode.addView(viewNode);
    bottomLayer.length && this.hideAll({ layer: bottomLayer, _filter: [bvC] });
    return viewNode;
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

  getInfo(id: number) {
    return this.config?.[id];
  }

  preload(id: number | number[]) {
    if (typeof id === "number") {
      const res = this.config?.[id];
      if (!res) {
        return;
      }
      const { path, bundleName, bundleVersion } = res;
      ResMgr.preload({
        path,
        bundleName,
        bundleVersion,
        type: Prefab,
      });
      return;
    }
    const map = new ArrayMap<string, string>();
    id.forEach((v) => {
      const res = this.config?.[v];
      if (!res) {
        return;
      }
      const { path, bundleName, bundleVersion } = res;
      map.setValue(bundleName + "_" + bundleVersion, path);
    });
    map.forEach((paths, key) => {
      const [bundleName, bundleVersion] = key.split("_");
      ResMgr.preload({
        path: paths,
        bundleName,
        bundleVersion,
        type: Prefab,
      });
    });
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
      const node = target[0].node;
      node.setTemporaryProperty("$LastRecycleTime", Date.now());
      this.viewCache.setValue(id, node);
      if (this.viewCache.allSizeValue() > MAX_CACHE_SIZE) {
        const all = this.viewCache.allValues().sort((a, b) => {
          return (
            b.getTemporaryProperty("$LastRecycleTime") -
            a.getTemporaryProperty("$LastRecycleTime")
          );
        });
        let count = LRU_DELETE_COUNT;
        while (count > 0 && all.length > 0) {
          const node = all.pop();
          node.destroy();
          // @ts-ignore
          node._prefab?.asset.decRef(false);
          this.viewCache.deleteValue(node);
          count--;
        }
      }
    }
    if (bvCs.length === 0) {
      this.viewMap.delete(id);
    } else {
      this.viewMap.set(id, bvCs);
    }
  }

  async showLaunch() {
    let res = this.defaultConfig["Launch"];
    if (!res) {
      res = {
        path: "InternalLaunch",
        bundleName: "internal-prefabs",
      };
    }
    this.config["Launch"] = {
      ...res,
      layer: "Launch",
    };
    // @ts-ignore
    const node = await this.show("Launch");
    const baseLaunchC = node.getComponent(BaseLaunch);
    return new LaunchTracker(baseLaunchC, () => {
      const layerLaunch = this.layers.get("Launch");
      layerLaunch.destroy();
      this.layers.delete("Launch");
    });
  }
}

const UIMgr = UIManager.getInstance();
export default UIMgr;
