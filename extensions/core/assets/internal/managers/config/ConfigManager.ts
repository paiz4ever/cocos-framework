/**
 * 配置管理器
 */
import { JsonAsset, warn } from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";
import * as schema from "./schema/schema";
import ResMgr from "../res/ResManager";

type TConfig = TBuiltinConfig & TGameConfig;

class ConfigManager extends Singleton {
  private declare _tables: schema.Tables;
  private declare _cnf: TConfig;
  get tables(): schema.Tables {
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
    ResMgr.removeBundle("tables");
    this._tables = new schema.Tables((fileName: string) => {
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
