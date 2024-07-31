import { ConfigUtil } from "builtin/utils/config";

/**
 * 在这里覆盖默认UI
 * @notice Toast预制件脚本请继承或直接使用 builtin/components/ui/Toast
 */
ConfigUtil.coverDefaultUI({});

export enum UIID {
  UIGame,
  UITest,
}

/**
 * 这里配置UI映射
 */
ConfigUtil.injectUI({
  config: {
    [UIID.UIGame]: { path: "UIGame", layer: "Game" },
    [UIID.UITest]: { path: "UITest", layer: "Modal" },
  },
  bundle: "dev-test",
});
