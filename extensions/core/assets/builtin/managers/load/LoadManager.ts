/**
 * 资源加载管理器
 */
import { Asset, AssetManager, JsonAsset, SpriteFrame, assetManager } from "cc";
import Singleton from "../../structs/abstract/Singleton";

class LoadManager extends Singleton {
  load<T extends Asset>(options: {
    path: string;
    bundle?: string;
    type?: new (...args: any[]) => T;
  }): Promise<T> {
    return this.loadBundle({ name: options.bundle }).then((bundle) => {
      return new Promise((resolve, reject) => {
        bundle.load(options.path, options?.type, (err, asset) => {
          if (err) return reject(err);
          resolve(asset);
        });
      });
    });
  }

  loadDir<T extends Asset>(options: {
    path?: string;
    bundle?: string;
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
    path: string;
    bundle?: string;
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

  private loadBundle(options?: {
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
}

const LoadMgr = LoadManager.getInstance();
export default LoadMgr;
