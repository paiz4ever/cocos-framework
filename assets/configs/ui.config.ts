import { ConfigUtil } from "builtin/utils/config";

export enum UIID {
  Home,
  Demo,
}

/**
 * 定义UI映射
 * @notice 所有页面预制件脚本请继承或直接使用 builtin/components/ui/BaseView
 * @notice 推荐使用UIID进行页面管理
 * @example
 * // 每个ui单独定义
 * ConfigUtil.defineUI(
 *  {
 *    [UIID.Test]: { path: "test", layer: "Scene", bundleName: "bundleA" },
 *    [UIID.Test2]: { path: "test2", layer: "Scene", bundleName: "bundleA" }
 *  }
 * )
 * // 同bundle可以合并
 * ConfigUtil.defineUI(
 *  {
 *    config: {
 *      [UIID.Test]: { path: "test", layer: "Scene" },
 *      [UIID.Test2]: { path: "test2", layer: "Scene" }
 *    },
 *    bundle: "bundleA"
 *  }
 * )
 * // 定义不同bundle
 * ConfigUtil.defineUI(
 *  { [UIID.Test]: { path: "A/test", layer: "Scene", bundleName: "bundleA" } },
 *  {
 *     config: {
 *      [UIID.Test2]: { path: "B/test2", layer: "Scene" },
 *      [UIID.Test3]: { path: "B/test3", layer: "Scene" },
 *    },
 *    bundle: "bundleB",
 *  }
 * )
 */
ConfigUtil.defineUI({});

/**
 * 定义默认UI
 * @notice Toast预制件脚本请继承或直接使用 builtin/components/ui/BaseToast
 * @notice 启动页（Launch）预制件脚本请继承或直接使用 builtin/components/ui/BaseLaunch
 */
ConfigUtil.defineDefaultUI({});
