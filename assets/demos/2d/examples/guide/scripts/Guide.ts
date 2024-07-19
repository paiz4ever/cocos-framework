import {
  _decorator,
  BlockInputEvents,
  Camera,
  Canvas,
  Color,
  Component,
  director,
  EventTouch,
  find,
  Input,
  instantiate,
  Layers,
  Node,
  NodePool,
  RenderTexture,
  Sprite,
  SpriteFrame,
  tween,
  v3,
  view,
} from "cc";
import { LoadMgr } from "core/builtin/managers";
import { alignFullScreen } from "core/builtin/utils/ui-layout";
import GuideSys from "../../../packages/guide";
import { createMask } from "core/builtin/utils/node";
import Root from "core/root/Root";
const { ccclass, property } = _decorator;

@ccclass("Guide")
export class Guide extends Root {
  protected appConfig: IAppConfig = {};

  @property(Node)
  declare animNode: Node;

  private declare layer: number;

  protected onInitComplete(): Promise<undefined> {
    tween(this.animNode)
      .to(0.2, { scale: v3(1.2, 1.2, 1.2) })
      .to(0.2, { scale: v3(1, 1, 1) })
      .union()
      .repeatForever()
      .start();

    GuideSys.init({
      reader: async () => {
        return {
          defaultStepID: 10000,
          lastStepID: undefined,
        };
      },
      writer: async (stepID: number) => {
        console.log("writer", stepID);
      },
    });
    (window as any).GuideSys = GuideSys;
    return super.onInitComplete();
  }
}
