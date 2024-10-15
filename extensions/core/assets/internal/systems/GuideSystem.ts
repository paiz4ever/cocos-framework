import { Layers } from "cc";
import { Singleton } from "../../builtin/structs";
import app from "../../module/index";
import { GuideItem } from "../../builtin/definitions/table/schema";

function createGuideLayer() {
  for (let i = 0; i <= 19; i++) {
    const layerName = Layers.layerToName(i);
    if (layerName === "GUIDE") return i;
    if (layerName) continue;
    Layers.addLayer("GUIDE", i);
    return i;
  }
  return -1;
}

type TGuideBody = {
  startStepID: number;
  stepID?: number;
};

class GuideSystem extends Singleton {
  private declare guideItem: GuideItem;
  private declare conditionFuncs: Map<string, () => Promise<boolean>>;

  get stepID() {
    return this.guideItem.id;
  }

  register(condition: string, fn: () => Promise<boolean>) {
    if (!this.conditionFuncs) this.conditionFuncs = new Map();
    if (this.conditionFuncs.has(condition)) {
      console.warn(`Condition "${condition}" has been registered`);
    }
    this.conditionFuncs.set(condition, fn);
    if (this.guideItem && this.guideItem.condition === condition) {
      this.trigger();
    }
  }

  init(options: {
    reader: () => Promise<TGuideBody>;
    writer: (body: TGuideBody) => Promise<void>;
    reporter?: (error: string) => Promise<void>;
  }) {
    const { reader, writer, reporter } = options;
    const layer = createGuideLayer();
    if (layer === -1) {
      console.warn(
        "GuideSystem init failed because the layer could not be found"
      );
      return;
    }
    if (!app.root.initialized) {
      console.warn("App not initialized yet, please initialize the app first");
      return;
    }
    reader().then((body) => {
      const { startStepID, stepID } = body;
      if (!stepID) {
        this.guideItem = app.table.TbGuide.get(startStepID)!;
      } else {
        const item = app.table.TbGuide?.get(stepID);
        if (!item || !item.next) {
          console.warn("Guide is over");
          return;
        }
        let id = item.redirect ? item.redirect : item.next;
        this.guideItem = app.table.TbGuide.get(id)!;
      }
      this.trigger();
    });
  }

  async trigger() {
    if (!this.guideItem) return;
    if (this.guideItem.condition) {
      const fn = this.conditionFuncs.get(this.guideItem.condition);
      if (!fn) return;
      const isOk = await fn();
      if (!isOk) return;
    }
  }

  reset() {}

  disable() {}

  enable() {}
}
const GuideSys = GuideSystem.getInstance();
export default GuideSys;
