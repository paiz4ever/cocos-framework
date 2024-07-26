import { UIMgr } from "../../internal/managers";

export namespace ConfigUtil {
  /**
   * 注入UI配置
   * 推荐使用UIID进行页面管理
   * @example
   * injectUI(
   *   { [UIID.Main]: { path: "", layer: "View" } },
   *   {
   *     config: {
   *       [UIID.BundleA1]: { path: "bundleA/test", layer: "View" },
   *     },
   *     bundle: "bundleA",
   *   },
   *   {
   *     config: {
   *       [UIID.BundleB1]: { path: "bundleB/test", layer: "View" },
   *     },
   *     bundle: { name: "bundleB", version: "f1234" },
   *   }
   * )
   */
  export function injectUI(
    ...arg: (
      | {
          config: { [x: number]: RemoveOptional<IUIResource> };
          bundle?: { name: string; version?: string } | string;
        }
      | { [x: number]: RemoveOptional<IUIResource> }
    )[]
  ) {
    const cnf: IUIConfig = Object.create(null);
    for (let data of arg) {
      if ((data as any).config) {
        const { config, bundle } = data as any;
        for (let key in config) {
          cnf[key] = config[key];
          if (bundle) {
            if (typeof bundle === "string") {
              cnf[key].bundleName = bundle;
            } else {
              cnf[key].bundleName = bundle.name;
              cnf[key].bundleVersion = bundle.version;
            }
          }
        }
      } else {
        Object.assign(cnf, data);
      }
    }
    UIMgr.config = cnf;
  }
}
