/**
 * 缓存管理器
 */
import { sys } from "cc";
import EventEmitter from "../../structs/abstract/EventEmitter";

// @ts-ignore
type TStorage = TBuiltinStorage & TGameStorage;

class StorageManager extends EventEmitter<TStorage> {
  private storageKey = "cocos-storage";
  private data: TStorage;

  constructor() {
    super();
    this.init();
  }

  init() {
    if (!this.get("installTime")) {
      this.set("installTime", Date.now());
    }
  }

  /** 获取所有缓存 */
  getAll(): TStorage | null {
    if (this.data !== undefined) {
      return this.data;
    }
    let dataStr = sys.localStorage.getItem(this.storageKey);
    if (!dataStr) {
      this.data = null;
    } else {
      this.data = JSON.parse(dataStr) as TStorage;
    }
    return this.data;
  }

  /** 获取缓存 */
  get<T extends keyof TStorage>(
    key: T,
    defaultValue?: Partial<TStorage[T]>
  ): TStorage[T] | null {
    let data = this.getAll();
    if (!data) return defaultValue !== undefined ? (defaultValue as any) : null;
    return data[key] !== undefined ? data[key] : (defaultValue as any);
  }

  /** 设置缓存 */
  set<T extends keyof TStorage>(
    key: T,
    vh: TStorage[T] | ((v: TStorage[T]) => TStorage[T])
  ) {
    let data = this.getAll();
    if (!data) {
      this.data = {} as TStorage;
      data = this.data;
    }
    if (typeof vh === "function") {
      data[key] = (vh as (v: TStorage[T]) => TStorage[T])(data[key]);
    } else {
      data[key] = vh;
    }
    // @ts-ignore
    this.emit(key, data[key]);
    sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /** 删除缓存 */
  del<T extends keyof TStorage>(key: T) {
    let data = this.getAll();
    if (!data) return;
    delete data[key];
    // @ts-ignore
    this.emit(key);
    sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /** 获取本天数据 */
  getDay<T extends ExtractTargetKey<DayExpire<any>, TStorage>>(
    key: T,
    defaultValue?: TStorage[T]["data"]
  ): TStorage[T]["data"] | null {
    let data = this.get(key, {
      // @ts-ignore
      data: defaultValue,
      expire: new Date().toLocaleDateString(),
    });
    // @ts-ignore
    if (data?.expire === new Date().toLocaleDateString()) {
      // @ts-ignore
      return data?.data;
    }
    return defaultValue !== undefined ? (defaultValue as any) : null;
  }

  /** 设置本天数据 */
  setDay<T extends ExtractTargetKey<DayExpire<any>, TStorage>>(
    key: T,
    vh: TStorage[T]["data"] | ((v: TStorage[T]["data"]) => TStorage[T]["data"])
  ) {
    let data = this.getAll();
    if (!data) {
      this.data = {} as TStorage;
      data = this.data;
    }
    if (typeof vh === "function") {
      // @ts-ignore
      data[key] = {
        data: (vh as (v: TStorage[T]["data"]) => TStorage[T]["data"])(
          // @ts-ignore
          data[key]?.data
        ),
        expire: new Date().toLocaleDateString(),
      };
    } else {
      // @ts-ignore
      data[key] = {
        data: vh,
        expire: new Date().toLocaleDateString(),
      };
    }
    // @ts-ignore
    this.emit(key, data[key]);
    sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /** 清空缓存 */
  clear() {
    let developerMode = this.get("onDebug", false);
    let developerSettings = this.get("debugSettings", {});
    this.data = undefined;
    sys.localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        developerMode,
        developerSettings,
      })
    );
    this.init();
  }
}

const StorageMgr = StorageManager.getInstance();
export default StorageMgr;
