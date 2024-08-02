import { DEBUG } from "cc/env";
import { UIMgr, AudioMgr } from "../../internal/managers";

export namespace ConfigUtil {
  export function coverDefaultUI(config: IUIDefaultConfig) {
    UIMgr.defaultConfig = config;
  }

  /**
   * 注入UI配置
   * 推荐使用UIID进行页面管理
   * @example
   * injectUI(
   *   { [UIID.Main]: { path: "", layer: "GameView", bundleName: "bundleA" } },
   *   {
   *     config: {
   *       [UIID.BundleA1]: { path: "bundleA/test", layer: "GameView" },
   *     },
   *     bundle: "bundleA" | { name: "bundleB", version: "f1234" },
   *   }
   * )
   */
  export function injectUI(
    ...arg: (
      | {
          config: { [x: number]: RemoveOptional<IUIResource> };
          bundle?: { name: string; version?: string } | string;
        }
      | { [x: number]: IUIResource }
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

  export function injectAudio(
    ...arg: (
      | {
          config: { [x: number]: string };
          bundle?: { name: string; version?: string } | string;
        }
      | { [x: number]: IResource }
    )[]
  ) {
    const cnf: IUIConfig = Object.create(null);
    for (let data of arg) {
      if ((data as any).config) {
        const { config, bundle } = data as any;
        for (let key in config) {
          cnf[key] = {
            path: config[key],
          };
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
    AudioMgr.config = cnf;
  }
}
if (DEBUG) (window as any)["ConfigUtil"] = ConfigUtil;
