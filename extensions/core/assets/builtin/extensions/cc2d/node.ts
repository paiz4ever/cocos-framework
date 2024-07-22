import { Component, Node } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Node.prototype.setComponent = function <T extends Component>(
    component: new () => T,
    handler?: (c: T) => void
  ): T {
    const self = this as Node;
    let c = self.getComponent(component);
    if (!c) {
      c = self.addComponent(component);
    }
    handler && handler(c);
    return c;
  };

  Node.prototype.activateSingleChild = function (index: number) {
    this.children.forEach((v, i) => (v.active = i === index));
  };
}
