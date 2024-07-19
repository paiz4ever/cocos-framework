/**
 * 资源加载管理器
 */
import { Asset, AssetManager, JsonAsset, SpriteFrame, assetManager } from "cc";
import Singleton from "../../structs/abstract/Singleton";

class LoadManager extends Singleton {
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

  loadSpriteFrame(options: {
    bundle: string;
    path: string;
  }): Promise<SpriteFrame> {
    return this.loadBundle({ name: options.bundle }).then((bundle) => {
      return new Promise((resolve, reject) => {
        bundle.load(
          options.path + "/spriteFrame",
          SpriteFrame,
          (err, spriteFrame) => {
            if (err) return reject(err);
            resolve(spriteFrame);
          }
        );
      });
    });
  }
}

const LoadMgr = LoadManager.getInstance();
export default LoadMgr;
