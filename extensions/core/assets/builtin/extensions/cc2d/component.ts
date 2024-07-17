import { Component } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Component.prototype.setComponent = function <T extends Component>(
    component: new () => T,
    handler?: (c: T) => void
  ): T {
    const ts = this as Component;
    return ts.node?.setComponent(component, handler);
  };
}
