import { _decorator, Component, Node } from "cc";
import { ConfigMgr } from "core/builtin/managers";
import Root from "core/root/Root";
const { ccclass, property } = _decorator;

@ccclass("MainScene")
export class MainScene extends Root {
  protected onInitBefore(): Promise<void> {
    /** 初始化App配置 */
    ConfigMgr.set("app", {
      /** 替换为自己的配置 */
      name: "GameName",
      appID: "AppID",
      domain: {
        prod: "https://prod.api.example.com",
        dev: "https://dev.api.example.com",
      },
    });
    /** 初始化平台配置 */
    ConfigMgr.set("platform", {
      /** 选择性设置平台参数 */
      ByteDance: {
        rewardAdUnitID: "RewardAdUnitID",
      },
    });
    return Promise.resolve(void 0);
  }

  protected onInitComplete(): Promise<void> {
    /** 此处执行展示首屏场景等操作 */
    /** ... */
    return Promise.resolve(void 0);
  }
}
