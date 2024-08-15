/**
 * 配置管理器
 */
import { JsonAsset, warn } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import { Tables } from "../../../builtin/definitions/schema";
import ResMgr from "../res/ResManager";

type TConfig = TInternalConfig & TGameConfig;

class ConfigManager extends Singleton {
  private declare _tables: Tables;
  private declare _cnf: TConfig;
  get tables(): Tables {
    return this._tables;
  }

  get cnf(): TConfig {
    return this._cnf || ({} as any);
  }

  async init(appConfig: IAppConfig) {
    let tableAssets = await ResMgr.loadDir({
      bundleName: "internal-tables",
      type: JsonAsset,
    });
    ResMgr.removeBundle("internal-tables");
    this._tables = new Tables((fileName: string) => {
      return tableAssets.find((asset) => asset.name === fileName)?.json || [];
    });
    this.set("app", appConfig);
  }

  get<T extends keyof TConfig>(key: T): TConfig[T] | undefined {
    return this._cnf[key];
  }

  set<T extends keyof TConfig>(key: T, value: TConfig[T]) {
    if (!this._cnf) this._cnf = {} as any;
    if (Object.hasOwn(this._cnf, key)) {
      warn("重复设置配置项: " + key);
    }
    this._cnf[key] = value;
  }
}

const ConfigMgr = ConfigManager.getInstance();
export default ConfigMgr;
