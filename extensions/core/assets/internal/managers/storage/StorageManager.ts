/**
 * 缓存管理器
 * // TODO
 * week expire
 */
import { sys } from "cc";
import SingleEventEmitter from "../../../builtin/structs/abstract/SingleEventEmitter";
import dayjs from "dayjs";

type TStorage = TInternalStorage & TGameStorage;

class StorageManager extends SingleEventEmitter<ToTuple<TStorage>> {
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

  get<
    T extends keyof OmitByValueType<TStorage, DayExpire<any> | WeekExpire<any>>
  >(key: T, defaultValue?: TStorage[T]): TStorage[T] | null {
    let data = this.getAll();
    if (!data) return defaultValue !== undefined ? (defaultValue as any) : null;
    return data[key] !== undefined ? data[key] : (defaultValue as any);
  }

  set<
    T extends keyof OmitByValueType<TStorage, DayExpire<any> | WeekExpire<any>>
  >(key: T, vh: TStorage[T] | ((v: TStorage[T]) => TStorage[T])) {
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

  del<T extends keyof TStorage>(key: T) {
    let data = this.getAll();
    if (!data) return;
    delete data[key];
    // @ts-ignore
    this.emit(key);
    sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getDay<T extends keyof PickByValueType<TStorage, DayExpire<any>>>(
    key: T,
    defaultValue?: TStorage[T]["data"]
  ): TStorage[T]["data"] | null {
    let data = this.get(
      key as any,
      {
        data: defaultValue,
        day: new Date().toLocaleDateString(),
      } as TStorage[T]
    );
    if (data?.day === new Date().toLocaleDateString()) {
      return data?.data;
    }
    return defaultValue !== undefined ? (defaultValue as any) : null;
  }

  setDay<T extends keyof PickByValueType<TStorage, DayExpire<any>>>(
    key: T,
    vh: TStorage[T]["data"] | ((v: TStorage[T]["data"]) => TStorage[T]["data"])
  ) {
    let data = this.getAll();
    if (!data) {
      this.data = {} as TStorage;
      data = this.data;
    }
    if (typeof vh === "function") {
      data[key] = {
        data: (vh as (v: TStorage[T]["data"]) => TStorage[T]["data"])(
          data[key]?.data
        ),
        day: new Date().toLocaleDateString(),
      } as TStorage[T];
    } else {
      data[key] = {
        data: vh,
        day: new Date().toLocaleDateString(),
      } as TStorage[T];
    }
    // @ts-ignore
    this.emit(key, data[key]);
    sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getWeek<T extends keyof PickByValueType<TStorage, WeekExpire<any>>>(
    key: T,
    defaultValue?: TStorage[T]["data"]
  ): TStorage[T]["data"] | null {
    let data = this.get(
      key as any,
      {
        data: defaultValue,
        week: new Date().toLocaleDateString(),
      } as TStorage[T]
    );
    if (data?.day === new Date().toLocaleDateString()) {
      return data?.data;
    }
    return defaultValue !== undefined ? (defaultValue as any) : null;
  }

  setWeek<T extends keyof PickByValueType<TStorage, WeekExpire<any>>>(
    key: T,
    vh: TStorage[T]["data"] | ((v: TStorage[T]["data"]) => TStorage[T]["data"])
  ) {
    let data = this.getAll();
    if (!data) {
      this.data = {} as TStorage;
      data = this.data;
    }
    if (typeof vh === "function") {
      data[key] = {
        data: (vh as (v: TStorage[T]["data"]) => TStorage[T]["data"])(
          data[key]?.data
        ),
        week: new Date().toLocaleDateString(),
      } as TStorage[T];
    } else {
      data[key] = {
        data: vh,
        week: new Date().toLocaleDateString(),
      } as TStorage[T];
    }
    // @ts-ignore
    this.emit(key, data[key]);
    sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

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
window.dayjs = dayjs;
