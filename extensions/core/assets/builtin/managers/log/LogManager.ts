/**
 * 日志管理器
 */
import { log } from "cc";
import Singleton from "../../structs/abstract/Singleton";
import EventMgr from "../event/EventManager";
import PlatformMgr from "../platform/PlatformManager";
import StorageMgr from "../storage/StorageManager";

class LogManager extends Singleton {
  private logs: string[];
  private isLogCache: boolean;
  missCount = 0;

  constructor() {
    super();
    this.logs = [];
    this.isLogCache = !!StorageMgr.get("onDebug");
    let ref;
    if (!this.isLogCache) {
      this.isLogCache = true;
      // 留出10秒时间开启开发者模式
      ref = setTimeout(() => {
        ref = null;
        this.isLogCache = !!StorageMgr.get("onDebug");
        if (!this.isLogCache) {
          this.missCount += this.logs.length;
          this.logs = [];
        }
      }, 10000);
    }
    StorageMgr.on("onDebug", (isOn) => {
      if (ref) {
        clearTimeout(ref);
        ref = null;
      }
      this.isLogCache = isOn;
    });
  }

  print(...args: any) {
    let env = PlatformMgr.getEnv();
    if (env === "development") {
      log(...args);
    }
    if (!this.isLogCache) {
      this.missCount++;
      return;
    }
    let prefix = new Date().toLocaleString() + "\t";
    let str: string;
    try {
      str = prefix;
      for (let arg of args) {
        if (typeof arg === "object") {
          arg = JSON.stringify(arg);
        }
        str += arg + " ";
      }
    } catch (e) {
      str = `${prefix}【内部错误】${e.message}`;
    }
    this.logs.push(str);
    EventMgr.emit("Log", str);
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.missCount = 0;
  }
}

const LogMgr = LogManager.getInstance();
export default LogMgr;
