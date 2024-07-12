import { Component, Node } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Node.prototype.setComponent = function <T extends Component>(
    component: new () => T,
    handler?: (c: T) => void
  ): T {
    const ts = this as Node;
    let c = ts.getComponent(component);
    if (!c) {
      c = ts.addComponent(component);
    }
    handler && handler(c);
    return c;
  };
}
