import app from "app";
import { _decorator, instantiate } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends app.comp.Root {
  protected appConfig: IAppConfig = {};

  protected onInitEnd(): Promise<any> {
    (window as any).createC = () => {
      app.res
        .loadPrefab({
          path: "B",
          bundleName: "bundleB",
        })
        .then((p) => {
          const nodeC = instantiate(p);
          this.node.addChild(nodeC);
          (window as any).c = nodeC;
          (window as any).cp = p;
        });
    };
    (window as any).createAB = () => {
      app.res
        .loadPrefab({
          path: "A",
          bundleName: "bundleA",
        })
        .then((p) => {
          const nodeA = instantiate(p);
          this.node.addChild(nodeA);
          (window as any).a = nodeA;
          (window as any).ap = p;
        });
      app.res
        .loadPrefab({
          path: "B",
          bundleName: "bundleB",
        })
        .then((p) => {
          const nodeB = instantiate(p);
          this.node.addChild(nodeB);
          (window as any).b = nodeB;
          (window as any).bp = p;
        });
    };
    return Promise.resolve();
  }
}
