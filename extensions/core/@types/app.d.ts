import { Asset, AssetManager, Component, Font, Label, sp, Sprite, SpriteFrame, Node, Prefab, Camera, Canvas, Event, AudioClip, NodePool } from "cc";
import { Tables } from "../assets/internal/managers/config/schema/schema";

declare module app {
  /**
   * 根组件
   * @example
   * class MyRoot extends app.Root {
   *    // 设置应用配置
   *    protected appConfig = {};
   *
   *    protected onInitStart() {
   *      // 初始化其他SDK或行为
   *      // ...
   *      return otherSDK.init();
   *    }
   *
   *    protected onInitEnd() {
   *      return app.ui.show({ id: UUID.Main });
   *    }
   * }
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
     * 初始化开始（可选）
     * @description 此时仅配置初始化完成
     */
    protected onInitStart(): Promise<any>;
    /**
     * 初始化结束（可选）
     * @description 所有初始化已完成，在此加载首页并进入
     */
    protected onInitEnd(): Promise<any>;
    /**
     * 初始化失败（可选）
     * @description 加载出现问题，你可以在此重启或者上报
     */
    protected onInitError(error: any): Promise<any>;
  }

  /**
   * 根组件实例
   */
  export const root: {
    /**
     * 2D主相机
     */
    readonly camera: Camera;
    /**
     * 2D渲染画布
     */
    readonly canvas: Canvas;
    /**
     * 根节点
     */
    readonly node: Node;
  };

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
     * @param options.bundleVersion 资源包版本（可选）
     * @example
     * app.res.loadBundle({ bundleName: "test" }).then((bundle) => {})
     */
    loadBundle(options?: { bundleName?: string; bundleVersion?: string }): Promise<AssetManager.Bundle>;
    /**
     * 获取已经加载的资源包
     * @param bundleName 资源包名称（可选，默认 resources）
     */
    getBundle(bundleName?: string): AssetManager.Bundle | null;
    /**
     * 移除已经加载的资源包
     * @param bundleName 资源包名称（可选，默认 resources）
     * @description 移除后会自动释放bundle资源
     */
    removeBundle(bundleName?: string): void;
    /**
     * 加载资源
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.type 资源类型（可选，存在同名资源时区分）
     * @param options.onProgress 加载进度（可选）
     * @example
     * // 加载SpriteFrame（无需path后缀添加'/spriteFrame'）
     * app.res.load({ path: "test", bundleName: "test", type: SpriteFrame }).then((asset) => {})
     */
    load<T extends Asset>(options: { path: string; bundleName?: string; bundleVersion?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T>;
    load<T extends Asset>(options: { path: string[]; bundleName?: string; bundleVersion?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T[]>;
    /**
     * 加载资源目录
     * @param options.path 资源路径目录
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.type 资源类型（可选，仅加载该类型资源）
     * @param options.onProgress 加载进度（可选）
     * @example
     * app.res.loadDir({ path: "/", bundleName: "test", type: SpriteFrame }).then((assets) => {})
     */
    loadDir<T extends Asset>(options: { path?: string; bundleName?: string; bundleVersion?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T[]>;
    /**
     * 预加载资源
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.type 资源类型（可选，存在同名资源时区分）
     * @param options.onProgress 加载进度（可选）
     * @example
     * app.res.preload({ path: "test", bundleName: "test", type: SpriteFrame }).then((items) => {})
     */
    preload<T extends Asset>(options: { path: string | string[]; bundleName?: string; bundleVersion?: string; type?: new (...args: any[]) => T; onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void }): Promise<AssetManager.RequestItem[]>;
    /**
     * 预加载资源目录
     * @param options.path 资源路径目录
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.type 资源类型（可选，仅加载该类型资源）
     * @param options.onProgress 加载进度（可选）
     * @example
     * app.res.preloadDir({ path: "/", bundleName: "test", type: SpriteFrame }).then((items) => {})
     */
    preloadDir<T extends Asset>(options: { path?: string; bundleName?: string; bundleVersion?: string; type?: new (...args: any[]) => T; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<AssetManager.RequestItem[]>;
    /**
     * 释放资源
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选）
     * @param options.type 资源类型（可选，存在同名资源时区分）
     * @notice 调用此函数请确保依赖资源的节点已经被销毁
     * @example
     * app.res.release({ path: "test", bundleName: "test", type: SpriteFrame })
     */
    release(options: { path: string; bundleName?: string; type?: typeof Asset }): void;
    /**
     * 释放所有资源
     * @param bundleName 资源包名称（可选，默认为 `resources`）
     * @notice 调用此函数请确保依赖资源的节点已经被销毁
     */
    releaseAll(bundleName?: string): void;
    /**
     * 释放未使用的资源
     * @param bundleName 资源包名称（可选，默认为 `resources`）
     * @notice 调用此函数请确保是自主正确的管理好资源的 `ref` 计数（一般此函数是用作 `decRef(false)` 残留下的资源）
     */
    releaseUnused(bundleName?: string): void;
    /**
     * 加载字体资源
     * @param options.path 资源路径
     * @param options.target 目标对象（可选）
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadFont(options: { path: string; target?: Label | Node; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<Font>;
    /**
     * 加载Spine资源
     * @param options.path 资源路径
     * @param options.target 目标对象（可选）
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadSpine(options: { path: string; target?: sp.Skeleton | Node; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<sp.SkeletonData>;
    /**
     * 加载图片资源
     * @param options.path 资源路径
     * @param options.target 目标对象（可选）
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadSpriteFrame(options: { path: string; target?: Sprite | Node; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<SpriteFrame>;
    /**
     * 加载预制体
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadPrefab(options: { path: string; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<Prefab>;
    loadPrefab(options: { path: string[]; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<Prefab[]>;
    /**
     * 加载音频
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadAudio(options: { path: string; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<AudioClip>;
    loadAudio(options: { path: string[]; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<AudioClip[]>;
    /**
     * 加载Json
     * @param options.path 资源路径
     * @param options.bundleName 资源包名称（可选，默认为 `resources`）
     * @param options.bundleVersion 资源包版本（可选）
     * @param options.onProgress 加载进度（可选）
     */
    loadJson<T = Object>(options: { path: string; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T>;
    loadJson<T = Object>(options: { path: string[]; bundleName?: string; bundleVersion?: string; onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void }): Promise<T[]>;
  };

  /**
   * ui管理
   */
  export const ui: {
    /**
     * 2D主相机（同root）
     */
    readonly camera: Camera;
    /**
     * 2D渲染画布（同root）
     */
    readonly canvas: Canvas;
    /**
     * ui根节点
     */
    readonly root: Node;
    /**
     * 是否正在loading
     */
    readonly isLoading: boolean;
    /**
     * 显示UI
     * @param options.id UIID
     * @param options.data 传递的数据
     * @param options.onShow UI挂载后触发（可选）
     * @param options.onHide UI隐藏前触发（可选）
     * @returns UI完全挂载后回调（onShow完毕）
     * @example
     * // 可以使用data传递函数来快捷设置回调
     * app.ui.show({ id: UIID.Test, data: { click: (bv: BaseView) => { console.log("点击了"); } } });
     * // UIViewUtil有许多通用的页面动画
     * app.ui.show({ id: UIID.Test, onShow: UIViewUtil.show.slideRTL, onHide: UIViewUtil.hide.slide } });
     */
    show(id: number): Promise<Node>;
    show(options: { id: number; data?: any; onShow?: (node: Node, data?: any) => Promise<void> | void; onHide?: (node: Node) => Promise<void> | void }): Promise<Node>;
    /**
     * 隐藏UI
     * @param options.id UIID
     * @param options.release 是否释放资源，优先级大于ui本身的设定（可选）
     * @param options.onHide UI隐藏前触发（可选）
     * @returns UI完全隐藏后回调（onHide完毕）
     */
    hide(id: number): void;
    hide(options: { id: number; release?: boolean; onHide?: (node: Node) => Promise<void> | void }): void;
    /**
     * 隐藏所有UI
     * @param options.layer 需要隐藏的层级（可选）
     * @param options.release 是否释放资源，优先级大于ui本身的设定（可选）
     * @returns 所有UI隐藏后回调
     */
    hideAll(options?: { layer?: TUILayer | TUILayer[]; release?: boolean }): void;
    /**
     * 切换UI
     * @param options.id UIID
     * @param options.data 传递的数据
     * @param options.onShow UI挂载后触发（可选）
     * @param options.onHide UI隐藏前触发（可选）
     * @returns UI完全挂载后回调（onShow完毕）
     */
    replace(options: { id: number; data?: any; onShow?: (node: Node, data?: any) => Promise<void> | void; onHide?: (node: Node) => Promise<void> | void }): Promise<Node>;
    /**
     * 显示toast
     * @param msg 消息内容
     * @param options.msg 消息内容
     * @param options.duration 消息持续时间（可选，单位：秒）
     */
    showToast(msg: string): void;
    showToast(options: { msg: string; duration?: number }): void;
    /**
     * 隐藏toast
     */
    hideToast(): void;
    /**
     * 显示loading
     * @returns uuid 关闭loading的唯一标识
     */
    showLoading(): string;
    /**
     * 隐藏loading
     * @param uuid 关闭loading的唯一标识（可选，不指定则关闭所有）
     */
    hideLoading(uuid?: string): void;
    /**
     * 屏蔽触摸
     * @returns uuid 关闭loading的唯一标识
     */
    block(): string;
    /**
     * 解除屏蔽触摸
     * @param uuid 关闭loading的唯一标识（可选，不指定则关闭所有）
     */
    unblock(uuid?: string): void;
    /**
     * 触摸监听
     * @param callback 注册回调
     */
    onTouch(callback: (evt: Event) => void): void;
    /**
     * 取消触摸监听
     * @param callback 注册回调（可选，不指定则取消所有监听）
     */
    offTouch(callback?: (evt: Event) => void): void;
    /**
     * 获取UI资源信息
     * @param id UIID
     */
    getInfo(id: number): IUIResource;
  };

  type TConfig = TInternalConfig & TGameConfig;
  /**
   * 数据配置管理
   * @example
   * app.config.get("test");
   * app.config.set("test", 100);
   */
  export const config: {
    /**
     * 获取配置
     * @param key 配置键
     */
    get<T extends keyof TConfig>(key: T): TConfig[T] | undefined;
    /**
     * 设置配置
     * @param key 配置键
     * @param value 配置值
     */
    set<T extends keyof TConfig>(key: T, value: TConfig[T]): void;
  };

  /**
   * 配置表管理（由xlsx生成的游戏配置）
   * @example
   * app.table.TbGuide.get(10000);
   * app.table.TbGuide.getDataList();
   */
  export const table: Tables;

  type TStorage = TInternalStorage & TGameStorage;
  /**
   * 存储管理
   */
  export const storage: {
    /**
     * 获取全部存储数据
     */
    getAll(): TStorage | null;
    /**
     * 获取存储数据
     * @param key 存储键
     * @param defaultValue 默认值（可选）
     */
    get<T extends keyof OmitByValueType<TStorage, DayExpire<any> | WeekExpire<any>>>(key: T, defaultValue: TStorage[T]): TStorage[T];
    get<T extends keyof OmitByValueType<TStorage, DayExpire<any> | WeekExpire<any>>>(key: T, defaultValue?: TStorage[T]): TStorage[T] | null;
    /**
     * 设置存储数据
     * @param key 存储键
     * @param vh 存储值或者一个函数（返回存储值）
     */
    set<T extends keyof OmitByValueType<TStorage, DayExpire<any> | WeekExpire<any>>>(key: T, vh: TStorage[T] | ((v: TStorage[T]) => TStorage[T])): void;
    /**
     * 删除存储数据
     * @param key 存储键
     */
    del<T extends keyof TStorage>(key: T): void;
    /**
     * 获取天过期数据
     * @param key 存储键
     * @param defaultValue 默认值（可选）
     * @example
     * // 使用 DayExpire 进行配置
     * type TGameStorage = {
     *   // 天过期数据
     *   dataNum: DayExpire<number>;
     *   dataBoolean: DayExpire<boolean>;
     * };
     *
     * app.storage.getDay("dataNum", 0);
     * app.storage.getDay("dataBoolean");
     */
    getDay<T extends keyof PickByValueType<TStorage, DayExpire<any>>>(key: T, defaultValue?: TStorage[T]["data"]): TStorage[T]["data"] | null;
    /**
     * 设置天过期数据
     * @param key 存储键
     * @param vh 存储值或者一个函数（返回存储值）
     * @example
     * app.storage.setDay("dataNum", 100);
     * app.storage.setDay("dataBoolean", () => a === b);
     */
    setDay<T extends keyof PickByValueType<TStorage, DayExpire<any>>>(key: T, vh: TStorage[T]["data"] | ((v: TStorage[T]["data"]) => TStorage[T]["data"])): void;
    /**
     * 获取周过期数据
     * @param key 存储键
     * @param defaultValue 默认值（可选）
     * @example
     * // 使用 WeekExpire 进行配置
     * type TGameStorage = {
     *   // 周过期数据
     *   dataNum: WeekExpire<number>;
     *   dataBoolean: WeekExpire<boolean>;
     * };
     *
     * app.storage.getWeek("dataNum", 0);
     * app.storage.getWeek("dataBoolean");
     */
    getWeek<T extends keyof PickByValueType<TStorage, WeekExpire<any>>>(key: T, defaultValue?: TStorage[T]["data"]): TStorage[T]["data"] | null;
    /**
     * 设置周过期数据
     * @param key 存储键
     * @param vh 存储值或者一个函数（返回存储值）
     * @example
     * app.storage.setWeek("dataNum", 100);
     */
    setWeek<T extends keyof PickByValueType<TStorage, WeekExpire<any>>>(key: T, vh: TStorage[T]["data"] | ((v: TStorage[T]["data"]) => TStorage[T]["data"])): void;
    /**
     * 清除存储数据
     * @notice 调试相关设置会被保留
     */
    clear(): void;
    /**
     * 监听数据变化
     * @param key 存储键
     * @param listener 监听回调
     * @param thisArg 监听回调this指向（可选）
     */
    on<K extends keyof ToTuple<TStorage>>(key: K, listener: EventCallback<ToTuple<TStorage>[K]>, thisArg?: any): void;
    /**
     * 监听数据变化一次
     * @param key 存储键
     * @param listener 监听回调
     * @param thisArg 监听回调this指向（可选）
     */
    once<K extends keyof ToTuple<TStorage>>(key: K, listener: EventCallback<ToTuple<TStorage>[K]>, thisArg?: any): void;
    /**
     * 取消监听
     * @param key 存储键
     * @param listener 监听回调（可选，不传则取消该key的所有监听）
     * @param thisArg 监听回调this指向（可选）
     */
    off<K extends keyof ToTuple<TStorage>>(key: K, listener?: EventCallback<ToTuple<TStorage>[K]>, thisArg?: any): void;
    /**
     * 取消目标所有监听
     * @param thisArg 监听回调this指向
     */
    offTarget(thisArg: any): void;
  };

  /**
   * 平台管理
   */
  export const platform: IPlatform;

  /**
   * http管理
   */
  export const http: {
    /**
     * 发送post请求
     * @param options.url 请求地址
     * @param options.data 请求数据
     * @param options.isFullUrl 是否完整url（可选，默认为 `false`）
     * @example
     * app.http.post({ url: "/test/login", data: { username: "test", password: "123456" } }).then((result) => {})
     */
    post<T = any>(options: IHttpOptions): Promise<T>;
    /**
     * 发送get请求
     * @param options.url 请求地址
     * @param options.data 请求数据
     * @param options.isFullUrl 是否完整url（可选，默认为 `false`）
     * @example
     * app.http.get({ url: "http://example.com/test", isFullUrl: true }).then((result) => {})
     */
    get<T = any>(options: IHttpOptions): Promise<T>;
  };

  type TEvent = TInternalEvent & TGameEvent;
  /**
   * 事件管理
   */
  export const event: {
    emit<K extends keyof TEvent>(event: K, ...data: TEvent[K] extends void ? [] : TEvent[K] extends any[] ? TEvent[K] : [TEvent[K]]): void;
    /**
     * 监听事件
     * @param event 事件名
     * @param listener 监听回调
     * @param thisArg 监听回调this指向（可选）
     */
    on<K extends keyof TEvent>(event: K, listener: EventCallback<TEvent[K]>, thisArg?: any): void;
    /**
     * 监听事件一次
     * @param event 事件名
     * @param listener 监听回调
     * @param thisArg 监听回调this指向（可选）
     */
    once<K extends keyof TEvent>(event: K, listener: EventCallback<TEvent[K]>, thisArg?: any): void;
    /**
     * 取消监听
     * @param event 事件名
     * @param listener 监听回调（可选，不传则取消该key的所有监听）
     * @param thisArg 监听回调this指向（可选）
     */
    off<K extends keyof TEvent>(event: K, listener?: EventCallback<TEvent[K]>, thisArg?: any): void;
    /**
     * 取消目标所有监听
     * @param thisArg 监听回调this指向
     */
    offTarget(thisArg: any): void;
  };

  /**
   * 音频管理
   */
  export const audio: {
    /**
     * 音乐是否正在播放
     */
    readonly isMusicPlaying: boolean;
    /**
     * 音乐静音
     * @default false
     */
    musicMuted: boolean;
    /**
     * 音效静音
     * @default false
     */
    effectMuted: boolean;
    /**
     * 音乐音量
     * @notice 调整音量会取消静音
     * @default 1
     * @range [0, 1]
     */
    musicVolume: number;
    /**
     * 音效音量
     * @notice 调整音量会取消静音
     * @default 1
     * @range [0, 1]
     */
    effectVolume: number;
    /**
     * 播放音乐
     * @param options.id 音频ID
     * @param options.repeat 循环次数（可选，默认为 `macro.REPEAT_FOREVER`）
     * @param options.volume 音量（可选，范围为 `[0, 1]`，默认为 `1`）
     * @param options.cover 当音频相同时是否覆盖播放（可选）
     */
    playMusic(options: { id: number; repeat?: number; volume?: number; cover?: boolean }): Promise<void>;
    /**
     * 停止播放音乐
     * @notice 通过音乐停止后会被回收，无法恢复播放
     */
    stopMusic(): void;
    /**
     * 暂停播放音乐
     */
    pauseMusic(): void;
    /**
     * 恢复播放音乐
     */
    resumeMusic(): void;
    /**
     * 播放音效
     * @param options.id 音频ID
     * @param options.repeat 循环次数（可选，默认为 `1`）
     * @param options.volume 音量（可选，范围为 `[0, 1]`，默认为 `1`）
     * @returns 音效uuid（用作停止、暂停、恢复）
     */
    playEffect(options: { id: number; repeat?: number; volume?: number }): Promise<string>;
    /**
     * 停止播放音效
     * @param uuid 音效uuid（可选，不指定则停止所有）
     * @notice 通过音效停止后会被回收，无法恢复播放
     */
    stopEffect(uuid?: string): void;
    /**
     * 暂停播放音效
     * @param uuid 音效uuid（可选，不指定则暂停所有）
     */
    pauseEffect(uuid?: string): void;
    /**
     * 恢复播放音效
     * @param uuid 音效uuid（可选，不指定则恢复所有）
     */
    resumeEffect(uuid?: string): void;
    /**
     * 释放音频资源
     * @param id 音频ID
     */
    release(ids: number[]): void;
    release(id: number): void;
    /**
     * 预加载音频资源
     * @param id 音频ID
     */
    preload(ids: number[]): void;
    preload(id: number): void;
    /**
     * 获取音频资源信息
     * @param id 音频ID
     */
    getInfo(id: number): IResource;
  };

  /**
   * 多语言管理
   * @description 资源请放置在 assets/language 路径下的各自语言目录中
   * @description 使用 builtin/components/language 中组件进行多语言控制
   */
  export const language: {
    /**
     * 当前语言
     */
    readonly current: TLanguage;
    /**
     * 设置语言
     * @param lang 语言
     */
    set(lang: TLanguage): Promise<void>;
    /**
     * 语言是否支持
     * @param langs 语言
     */
    isSupport(langs: TLanguage[] | TLanguage): boolean;
  };

  /**
   * 工具
   */
  export const utils: {
    /**
     * 获取节点池
     * @param key 节点池key
     */
    pool(key: string): NodePool;
  };

  /**
   * 定时管理
   */
  export const timer: any;

  export function log(): void;
  export function warn(): void;
  export function error(): void;

  /**
   * 红点管理
   */
  export const redDot: any;
  /**
   * 引导管理
   */
  export const guide: any;
}

export default app;
