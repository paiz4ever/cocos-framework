import { ConfigUtil } from "builtin/utils/config";

export enum UIID {
  UITest,
}

/**
 * 在这里覆盖默认UI
 * @notice Toast预制件脚本请继承 builtin/components/ui/Toast
 */
ConfigUtil.coverDefaultUI({});

ConfigUtil.injectUI({
  config: { [UIID.UITest]: { path: "UITest", layer: "GameView" } },
  bundle: "dev-test",
});
