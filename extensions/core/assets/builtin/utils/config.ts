import { DEBUG } from "cc/env";
import { UIMgr, AudioMgr } from "../../internal/managers";

export namespace ConfigUtil {
  export function defineDefaultUI(config: IUIDefaultConfig) {
    UIMgr.defaultConfig = config;
  }

  export function defineUI(
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

  export function defineAudio(
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
