import { _decorator, Component, Node } from "cc";
import Root from "core/root/Root";
const { ccclass, property } = _decorator;

@ccclass("MainScene")
export class MainScene extends Root {
  /** 替换为自己的配置 */
  protected appConfig: IAppConfig = {
    name: "xxx",
    appID: "xxxxxx",
    domain: {
      prod: "https://prod.xxxxxx.com",
      dev: "https://dev.xxxxxx.com",
    },
    /** 选择性设置平台参数 */
    platform: {
      ByteDance: {
        rewardAdUnitID: "xxxxxxxxxx",
      },
    },
  };

  protected onInitComplete(): Promise<void> {
    /** 此处执行展示首屏场景等操作 */
    /** ... */
    return Promise.resolve(void 0);
  }
}
