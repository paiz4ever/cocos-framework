import { ConfigUtil } from "builtin/utils/config";

/**
 * 覆盖默认UI
 * @notice Toast预制件脚本请继承或直接使用 builtin/components/ui/BaseToast
 * @notice Launch预制件脚本请继承或直接使用 builtin/components/ui/BaseLaunch
 */
ConfigUtil.coverDefaultUI({});

export enum UIID {
  UIGame,
  UITest,
  UITest2,
  UITest3,
}

/**
 * UI映射
 */
ConfigUtil.injectUI(
  {
    config: {
      [UIID.UIGame]: { path: "UIGame", layer: "Scene" },
      [UIID.UITest]: { path: "UITest", layer: "Modal" },
      [UIID.UITest2]: { path: "UITest2", layer: "Modal" },
      [UIID.UITest3]: { path: "UITest3", layer: "Modal" },
    },
    bundle: "dev-test",
  },
  {
    [UIID.UIGame]: { path: "UIGame", layer: "Scene", bundleName: "dev-test" },
  }
);
