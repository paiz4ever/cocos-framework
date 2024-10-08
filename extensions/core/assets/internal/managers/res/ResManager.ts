/**
 * 资源管理器
 */
import {
  Asset,
  AssetManager,
  AudioClip,
  Font,
  JsonAsset,
  Label,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  assetManager,
  sp,
} from "cc";
import Singleton from "../../../builtin/structs/abstract/Singleton";

class ResManager extends Singleton {
  async init() {
    await this.loadDir({ bundleName: "internal-textures" });
    await this.loadBundle({ bundleName: "internal-language" });
  }

  loadRemote(options: { url: string; ext?: string }): Promise<Asset> {
    const { url, ext } = options;
    return new Promise((resolve, reject) => {
      assetManager.loadRemote(url, ext ? { ext } : null, (err, asset) => {
        if (err) return reject(err);
        resolve(asset);
      });
    });
  }

  loadBundle(options?: {
    bundleName?: string;
    bundleVersion?: string;
  }): Promise<AssetManager.Bundle> {
    let { bundleName, bundleVersion } = options;
    if (!bundleName) bundleName = "resources";
    return new Promise((resolve, reject) => {
      if (assetManager.bundles.has(bundleName)) {
        resolve(assetManager.bundles.get(bundleName));
        return;
      }
      if (bundleVersion) {
        assetManager.loadBundle(
          bundleName,
          { version: bundleVersion },
          (err, bundle) => {
            if (err) return reject(err);
            resolve(bundle);
          }
        );
      } else {
        assetManager.loadBundle(bundleName, (err, bundle) => {
          if (err) return reject(err);
          resolve(bundle);
        });
      }
    });
  }

  getBundle(bundleName?: string): AssetManager.Bundle {
    if (!bundleName) bundleName = "resources";
    return assetManager.getBundle(bundleName);
  }

  removeBundle(bundleName?: string) {
    if (!bundleName) bundleName = "resources";
    this.releaseAll(bundleName);
    const bundle = assetManager.getBundle(bundleName);
    if (bundle) assetManager.removeBundle(bundle);
  }

  preload<T extends Asset>(options: {
    path: string | string[];
    bundleName?: string;
    bundleVersion?: string;
    type?: new (...args: any[]) => T;
    onProgress?: (
      finish: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<AssetManager.RequestItem[]> {
    let { path, bundleName, bundleVersion, type, onProgress } = options;
    return this.loadBundle({ bundleName, bundleVersion }).then((bundle) => {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        if (type === SpriteFrame) {
          if (typeof path === "string") {
            !path.endsWith("/spriteFrame") && (path += "/spriteFrame");
          } else {
            path = path.map((v) => {
              if (!v.endsWith("/spriteFrame")) {
                return v + "/spriteFrame";
              }
              return v;
            });
          }
        }
        bundle.preload(path, type, onProgress, (err, items) => {
          if (err) return reject(err);
          resolve(items);
        });
      });
    });
  }

  preloadDir<T extends Asset>(options: {
    path?: string;
    bundleName?: string;
    bundleVersion?: string;
    type?: new (...args: any[]) => T;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<AssetManager.RequestItem[]> {
    const { path, type, bundleName, bundleVersion, onProgress } = options;
    return this.loadBundle({ bundleName, bundleVersion }).then((bundle) => {
      return new Promise((resolve, reject) => {
        bundle.preloadDir(path || "", type, onProgress, (err, items) => {
          if (err) return reject(err);
          resolve(items);
        });
      });
    });
  }

  load<T extends Asset>(options: {
    path: string;
    bundleName?: string;
    bundleVersion?: string;
    type?: new (...args: any[]) => T;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<T>;
  load<T extends Asset>(options: {
    path: string[];
    bundleName?: string;
    bundleVersion?: string;
    type?: new (...args: any[]) => T;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<T[]>;
  load<T extends Asset>(options: {
    path: string | string[];
    bundleName?: string;
    bundleVersion?: string;
    type?: new (...args: any[]) => T;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<T | T[]> {
    let { path, bundleName, bundleVersion, type, onProgress } = options;
    return this.loadBundle({ bundleName, bundleVersion }).then((bundle) => {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        if (type === SpriteFrame) {
          if (typeof path === "string") {
            !path.endsWith("/spriteFrame") && (path += "/spriteFrame");
          } else {
            path = path.map((v) => {
              if (!v.endsWith("/spriteFrame")) {
                return v + "/spriteFrame";
              }
              return v;
            });
          }
        }
        bundle.load(path as any, type, onProgress, (err, asset) => {
          if (err) return reject(err);
          resolve(asset);
        });
      });
    });
  }

  loadDir<T extends Asset>(options: {
    path?: string;
    bundleName?: string;
    bundleVersion?: string;
    type?: new (...args: any[]) => T;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<T[]> {
    const { path, type, bundleName, bundleVersion, onProgress } = options;
    return this.loadBundle({ bundleName, bundleVersion }).then((bundle) => {
      return new Promise((resolve, reject) => {
        bundle.loadDir(path || "", type, onProgress, (err, assets) => {
          if (err) return reject(err);
          resolve(assets);
        });
      });
    });
  }

  release(options: { path: string; bundleName?: string; type?: typeof Asset }) {
    let { path, bundleName, type } = options;
    if (!bundleName) bundleName = "resources";
    assetManager.getBundle(bundleName)?.release(path, type);
  }

  releaseAll(bundleName?: string) {
    if (!bundleName) bundleName = "resources";
    const bundle = assetManager.getBundle(bundleName);
    if (!bundle) return;
    bundle.getDirWithPath("/", Asset).forEach((asset) => {
      bundle.release(asset.path, asset.ctor);
    });
  }

  releaseUnused(bundleName?: string) {
    if (!bundleName) bundleName = "resources";
    //@ts-ignore
    assetManager.getBundle(bundleName)?.releaseUnusedAssets();
  }

  loadFont(options: {
    path: string;
    target?: Label | Node;
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<Font> {
    let { target, path, bundleName, bundleVersion, onProgress } = options;
    if (target instanceof Node) {
      target = target.getComponent(Label);
    }
    return this.load({
      path,
      bundleName,
      bundleVersion,
      type: Font,
      onProgress,
    }).then((asset) => {
      if (target && target.isValid) {
        target.font = asset;
      }
      return asset;
    });
  }

  loadSpine(options: {
    path: string;
    target?: sp.Skeleton;
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<sp.SkeletonData> {
    let { target, path, bundleName, bundleVersion, onProgress } = options;
    if (target instanceof Node) {
      target = target.getComponent(sp.Skeleton);
    }
    return this.load({
      path,
      bundleName,
      bundleVersion,
      type: sp.SkeletonData,
      onProgress,
    }).then((asset) => {
      if (target && target.isValid) {
        target.skeletonData = asset;
      }
      return asset;
    });
  }

  loadSpriteFrame(options: {
    path: string;
    target?: Sprite;
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<SpriteFrame> {
    let { target, path, bundleName, bundleVersion, onProgress } = options;
    if (target instanceof Node) {
      target = target.getComponent(Sprite);
    }
    return this.load({
      path,
      bundleName,
      bundleVersion,
      type: SpriteFrame,
      onProgress,
    }).then((asset) => {
      if (target && target.isValid) {
        target.spriteFrame = asset;
      }
      return asset;
    });
  }

  loadPrefab(options: {
    path: string;
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<Prefab>;
  loadPrefab(options: {
    path: string[];
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<Prefab[]>;
  loadPrefab(options: {
    path: string | string[];
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<Prefab | Prefab[]> {
    let { path, bundleName, bundleVersion, onProgress } = options;
    return this.load({
      path: path as any,
      bundleName,
      bundleVersion,
      type: Prefab,
      onProgress,
    });
  }

  loadAudio(options: {
    path: string;
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<AudioClip>;
  loadAudio(options: {
    path: string[];
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<AudioClip[]>;
  loadAudio(options: {
    path: string | string[];
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<AudioClip | AudioClip[]> {
    let { path, bundleName, bundleVersion, onProgress } = options;
    return this.load({
      path: path as any,
      bundleName,
      bundleVersion,
      type: AudioClip,
      onProgress,
    });
  }

  loadJson(options: {
    path: string;
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<Object>;
  loadJson(options: {
    path: string[];
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<Object[]>;
  loadJson(options: {
    path: string | string[];
    bundleName?: string;
    bundleVersion?: string;
    onProgress?: (
      finished: number,
      total: number,
      item: AssetManager.RequestItem
    ) => void;
  }): Promise<Object | Object[]> {
    let { path, bundleName, bundleVersion, onProgress } = options;
    return this.load({
      path: path as any,
      bundleName,
      bundleVersion,
      type: JsonAsset,
      onProgress,
    }).then((jsonAsset) => {
      const json = jsonAsset.json;
      assetManager.releaseAsset(jsonAsset);
      return json;
    });
  }
}

const ResMgr = ResManager.getInstance();
export default ResMgr;
