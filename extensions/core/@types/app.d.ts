import { Asset, AssetManager, Component, Font, Label, sp, Sprite, SpriteFrame, Node, Prefab } from "cc";
import { Tables } from "../assets/internal/managers/config/schema/schema";

declare module app {
  /**
   * 入口Root
   */
  export abstract class Root extends Component {
    /**
     * 应用配置
     * @description
     * 配置不使用单独文件是由于同一个游戏在同一个平台可能存在不同的配置。
     * 这样在构建场景时仅需要修改到一个新场景即可
     */
    protected abstract appConfig: IAppConfig;
    /**
     * 初始化开始
     * @description 此时仅配置初始化完成
     */
    protected onInitStart(): Promise<any>;
    /**
     * 初始化结束
     * @description 所有初始化已完成，在此加载首页并进入
     */
    protected onInitEnd(): Promise<any>;
    /**
     * 初始化失败
     * @description 加载出现问题，你可以在此重启或者上报
     */
    protected onInitError(error: any): Promise<any>;
  }

  /**
   * 资源管理
   */
  export const res: {
    /**
     * 加载远程资源
     * @param options.url 资源地址
     * @param options.ext 资源后缀（可选，资源地址不带后缀时添加此项）
     * @example
     * app.res.loadRemote({ url: "http://example.com/test.png" }).then((asset) => {})
     * app.res.loadRemote({ url: "http://example.com/test", ext: ".png" }).then((asset) => {})
     */
    loadRemote(options: { url: string; ext?: string }): Promise<Asset>;
    /**
     * 加载资源包
     * @param options.bundleName 资源包名称（可选，默认 resources）
     * @param options.version 资源包版本（可选）
     * @example
     * app.res.loadBundle({ bundleName: "test" }).then((bundle) => {})
     */
    loadBundle(options?: { bundleName?: string; version?: string }): Promise<AssetManager.Bundle>;
    /**
     * 获取已经加载的资源包
     * @param bundleName 资源包名称（可选，默认 resources）
     */
    getBundle(bundleName?: string): AssetManager.Bundle | null;
    /**
     * 移除已经加载的资源包
     * @param bundleName 资源包名称（可选，默认 resources）
     */
    removeBundle(bundleName?: string): void;
    /**
     * 加载资源
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.type 资源类型（可选，存在同名资源时区分）
     * @param options.onProgress 加载进度（可选）
     * @example
     * // 加载SpriteFrame（无需path后缀添加'/spriteFrame'）
     * app.res.load({ path: "test", bundleName: "test", type: SpriteFrame }).then((asset) => {})
     */
    load<T extends Asset>(options: { path: string; bundleName?: string; version?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T>;
    load<T extends Asset>(options: { path: string[]; bundleName?: string; version?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T[]>;
    /**
     * 加载资源目录
     * @param options.path 资源路径目录
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.type 资源类型（可选，仅加载该类型资源）
     * @param options.onProgress 加载进度（可选）
     * @example
     * app.res.loadDir({ path: "/", bundleName: "test", type: SpriteFrame }).then((assets) => {})
     */
    loadDir<T extends Asset>(options: { path?: string; bundleName?: string; version?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T[]>;
    /**
     * 预加载资源
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.type 资源类型（可选，存在同名资源时区分）
     * @param options.onProgress 加载进度（可选）
     * @example
     * app.res.preload({ path: "test", bundleName: "test", type: SpriteFrame }).then((items) => {})
     */
    preload<T extends Asset>(options: { path: string | string[]; bundleName?: string; version?: string; type?: new (...args: any[]) => T; onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void }): Promise<AssetManager.RequestItem[]>;
    /**
     * 预加载资源目录
     * @param options.path 资源路径目录
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.type 资源类型（可选，仅加载该类型资源）
     * @param options.onProgress 加载进度（可选）
     * @example
     * app.res.preloadDir({ path: "/", bundleName: "test", type: SpriteFrame }).then((items) => {})
     */
    preloadDir<T extends Asset>(options: { path?: string; bundleName?: string; version?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<AssetManager.RequestItem[]>;
    /**
     * 释放资源
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选）
     * @param options.type 资源类型（可选，存在同名资源时区分）
     * @example
     * app.res.release({ path: "test", bundleName: "test", type: SpriteFrame })
     */
    release(options: { path: string; bundleName?: string; type?: typeof Asset }): void;
    /**
     * 释放所有资源
     * @param bundleName 资源包名称（可选，默认为 resources）
     */
    releaseAll(bundleName?: string): void;
    /**
     * 释放未使用的资源
     * @param bundleName 资源包名称（可选，默认为 resources）
     */
    releaseUnused(bundleName?: string): void;
    /**
     * 加载字体资源
     * @param options.path 资源路径
     * @param options.target 目标对象（可选）
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadFont(options: { path: string; target?: Label | Node; bundleName?: string; version?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<Font>;
    /**
     * 加载Spine资源
     * @param options.path 资源路径
     * @param options.target 目标对象（可选）
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadSpine(options: { path: string; target?: sp.Skeleton | Node; bundleName?: string; version?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<sp.SkeletonData>;
    /**
     * 加载图片资源
     * @param options.path 资源路径
     * @param options.target 目标对象（可选）
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadSpriteFrame(options: { path: string; target?: Sprite | Node; bundleName?: string; version?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<SpriteFrame>;
    /**
     * 加载预制体
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 resources）
     * @param options.version 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadPrefab(options: { path: string; bundleName?: string; version?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<Prefab>;
    loadPrefab(options: { path: string[]; bundleName?: string; version?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<Prefab[]>;
  };

  /**
   * ui管理
   */
  export const ui: any;

  export const audio: any;

  export const timer: any;

  export function log(): void;
  export function warn(): void;
  export function error(): void;

  export type TConfig = TBuiltinConfig & TGameConfig;
  export const config: {
    get<T extends keyof TConfig>(key: T): TConfig[T] | undefined;
    set<T extends keyof TConfig>(key: T, value: TConfig[T]): void;
  };

  export const table: Tables;

  type TStorage = TBuiltinStorage & TGameStorage;
  export const storage: {
    getAll(): TStorage | null;
    get<T extends keyof TStorage>(key: T, defaultValue?: Partial<TStorage[T]>): TStorage[T] | null;
    set<T extends keyof TStorage>(key: T, vh: TStorage[T] | ((v: TStorage[T]) => TStorage[T])): void;
    del<T extends keyof TStorage>(key: T): void;
    getDay<T extends ExtractTargetKey<DayExpire<any>, TStorage>>(key: T, defaultValue?: TStorage[T]["data"]): TStorage[T]["data"] | null;
    setDay<T extends ExtractTargetKey<DayExpire<any>, TStorage>>(key: T, vh: TStorage[T]["data"] | ((v: TStorage[T]["data"]) => TStorage[T]["data"])): void;
    clear(): void;
  };

  export const platform: IPlatform;

  export const http: {
    post<T = any>(options: IHttpOptions): Promise<T>;
    get<T = any>(options: IHttpOptions): Promise<T>;
  };

  type TEvent = TBuiltinEvent & TGameEvent;
  export const event: {
    emit<T extends keyof TEvent>(event: T, ...args: TEvent[T]): void;
    on<T extends keyof TEvent>(event: T, listener: (...args: TEvent[T]) => void, thisArg?: any): void;
    once<T extends keyof TEvent>(event: T, listener: (...args: TEvent[T]) => void, thisArg?: any): void;
    off<T extends keyof TEvent>(event: T, listener?: (...args: TEvent[T]) => void, thisArg?: any): void;
    offTarget(thisArg?: any): void;
  };

  export const redDot: any;
  export const guide: any;
}

export default app;
