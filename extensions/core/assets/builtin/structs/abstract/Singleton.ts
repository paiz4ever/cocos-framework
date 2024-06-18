/**
 * 单例
 */
export default abstract class Singleton {
  private static _instance: any;

  static getInstance<T>(this: new () => T): T {
    if (!(<any>this)._instance) {
      (<any>this)._instance = new this();
    }
    return (<any>this)._instance;
  }
}
