import {
  _decorator,
  BlockInputEvents,
  instantiate,
  js,
  Node,
  Prefab,
} from "cc";
import { LayerBase } from "./base";
import ResMgr from "../../res/ResManager";
const { ccclass, property } = _decorator;

export default class LayerLoading extends LayerBase {
  private declare loadingMap: Map<string, boolean>;
  private declare idg: js.IDGenerator;
  private declare blockInputEvents: BlockInputEvents;
  private declare loadingNode: Node;

  constructor() {
    super("__LayerLoading__");
    this.blockInputEvents = this.setComponent(
      BlockInputEvents,
      (c) => (c.enabled = false)
    );
    this.loadingMap = new Map();
    this.idg = new js.IDGenerator("LayerLoading");
  }

  get isLoading() {
    return !!this.loadingMap.size;
  }

  initDefault(res: IResource) {
    if (!res) {
      res = {
        path: "InternalLoading",
        bundleName: "internal-prefabs",
      };
    }
    ResMgr.loadPrefab(res).then((prefab) => {
      this.loadingNode = instantiate(prefab);
      this.loadingNode.active = !!this.loadingMap.size;
      this.addChild(this.loadingNode);
    });
  }

  act() {
    this.blockInputEvents.enabled = true;
    this.loadingNode && (this.loadingNode.active = true);
    const id = this.idg.getNewId();
    this.loadingMap.set(id, true);
    return id;
  }

  deact(uuid: string) {
    if (!uuid) {
      this.loadingMap.clear();
    } else {
      this.loadingMap.delete(uuid);
    }
    if (this.loadingMap.size === 0) {
      this.blockInputEvents.enabled = false;
      this.loadingNode && (this.loadingNode.active = false);
    }
  }
}
