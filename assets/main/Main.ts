import app from "app";
import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends app.Root {
  /** 替换为自己的配置 */
  protected appConfig = {
    name: "xxx",
    domain: {
      prod: "https://prod.xxxxxx.com",
      dev: "https://dev.xxxxxx.com",
    },
    /** 选择性设置平台参数 */
    platform: {
      ByteDance: {
        appID: "xxxxxx",
        rewardAdUnitID: "xxxxxxxxxx",
      },
    },
  };

  protected onInitEnd() {
    /** 此处执行展示首屏场景等操作 */
    /** ... */
    return Promise.resolve(void 0);
  }
}
