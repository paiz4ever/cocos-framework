import { _decorator, Component, Node } from "cc";
import Root from "core/root/Root";
const { ccclass, property } = _decorator;

@ccclass("MainScene")
export class MainScene extends Root {
  /** 替换为自己的配置 */
  protected appConfig: IAppConfig = {
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

  protected onInitComplete() {
    /** 此处执行展示首屏场景等操作 */
    /** ... */
    return Promise.resolve(void 0);
  }
}
