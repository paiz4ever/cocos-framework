import { JsonAsset } from "cc";
import Singleton from "../../../base/abstract/Singleton";
import { LoaderManager } from "../loader/LoaderManager";
import * as schema from "./schema/schema";

export class ConfigManager extends Singleton {
  private _tables: schema.Tables;
  get tables(): schema.Tables {
    return this._tables;
  }

  async init() {
    let cfgAssets = await LoaderManager.getInstance().loadDir({
      bundle: "cfgs",
      type: JsonAsset,
    });
    this._tables = new schema.Tables((fileName: string) => {
      return cfgAssets.find((asset) => asset.name === fileName)?.json;
    });
  }
}
