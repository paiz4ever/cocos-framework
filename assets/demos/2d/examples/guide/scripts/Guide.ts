import { _decorator, Input, Node, Prefab, tween, v3 } from "cc";
import GuideSys from "../../../packages/guide";
import Root from "core/root/Root";
const { ccclass, property } = _decorator;

@ccclass("Guide")
export class Guide extends Root {
  protected appConfig: IAppConfig = {};

  @property(Node)
  declare node1: Node;
  @property(Node)
  declare node2: Node;
  @property(Node)
  declare node3: Node;
  @property(Prefab)
  declare fingerPrefab: Prefab;

  private declare layer: number;

  protected onInitComplete(): Promise<undefined> {
    GuideSys.init({
      reader: () => {
        return new Promise((resolve) => {
          resolve({
            defaultStepID: 10000,
            lastStepID: undefined,
          });
        });
      },
      writer: async (stepID: number) => {
        console.log("writer", stepID);
      },
      prefabs: {
        finger: () => Promise.resolve(this.fingerPrefab),
      },
    });
    this.init();
    return super.onInitComplete();
  }

  init() {
    tween(this.node1)
      .to(0.2, { scale: v3(1.2, 1.2, 1.2) })
      .to(0.2, { scale: v3(1, 1, 1) })
      .union()
      .repeatForever()
      .start();
    this.node3.on(Input.EventType.TOUCH_END, () => {
      this.node3.destroy();
      GuideSys.trigger();
    });
  }
}
