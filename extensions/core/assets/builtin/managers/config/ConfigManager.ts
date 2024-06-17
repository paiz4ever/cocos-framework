import { JsonAsset, warn } from "cc";
import Singleton from "../../structs/abstract/Singleton";
import * as schema from "./schema/schema";
import LoadMgr from "../load/LoadManager";

// @ts-ignore
type TConfig = TBuiltinConfig & TGameConfig;

class ConfigManager extends Singleton {
  private _tables: schema.Tables;
  private _cnf: TConfig;
  get tables(): schema.Tables {
    return this._tables;
  }

  get cnf(): TConfig {
    return this._cnf;
  }

  async init() {
    let tableAssets = await LoadMgr.loadDir({
      bundle: "tables",
      type: JsonAsset,
    });
    this._tables = new schema.Tables((fileName: string) => {
      return tableAssets.find((asset) => asset.name === fileName)?.json;
    });
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
