import { Asset, AssetManager, JsonAsset, assetManager } from "cc";
import Singleton from "../../../base/abstract/Singleton";

export class LoaderManager extends Singleton {
  loadBundle(options?: {
    name?: string;
    version?: string;
  }): Promise<AssetManager.Bundle> {
    return new Promise((resolve, reject) => {
      if (options?.version) {
        assetManager.loadBundle(
          options?.name || "resources",
          { version: options?.version },
          (err, bundle) => {
            if (err) return reject(err);
            resolve(bundle);
          }
        );
      } else {
        assetManager.loadBundle(options?.name || "resources", (err, bundle) => {
          if (err) return reject(err);
          resolve(bundle);
        });
      }
    });
  }

  loadDir<T extends Asset>(options: {
    bundle: string;
    path?: string;
    type?: new (...args: any[]) => T;
  }): Promise<T[]> {
    return this.loadBundle({ name: options.bundle }).then((bundle) => {
      return new Promise((resolve, reject) => {
        bundle.loadDir(options.path || "", options?.type, (err, assets) => {
          if (err) return reject(err);
          resolve(assets);
        });
      });
    });
  }
}
