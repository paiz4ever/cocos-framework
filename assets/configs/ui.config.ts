import { ConfigUtil } from "builtin/utils/config";

export enum UIID {
  /** 主界面 */
  Main,
  /** 测试1 */
  BundleA1,
  /** 测试2 */
  BundleB1,
}

ConfigUtil.injectUI(
  {
    [UIID.Main]: { path: "test", layer: "View" },
  },
  {
    config: {
      [UIID.BundleA1]: { path: "test", layer: "View" },
    },
    bundle: "bundleA",
  },
  {
    config: {
      [UIID.BundleB1]: { path: "test", layer: "View" },
    },
    bundle: { name: "bundleB", version: "f1234" },
  }
);
