import EventEmitter from "./EventEmitter";

export default class SingleEventEmitter<T> extends EventEmitter<T> {
  private static _instance: any;

  static getInstance<T>(this: new () => T): T {
    if (!(<any>this)._instance) {
      (<any>this)._instance = new this();
    }
    return (<any>this)._instance;
  }
}
