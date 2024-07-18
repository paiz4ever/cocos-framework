import { Component } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Component.prototype.setComponent = function <T extends Component>(
    component: new () => T,
    handler?: (c: T) => void
  ): T {
    const self = this as Component;
    return self.node?.setComponent(component, handler);
  };
}
