import { _decorator, BlockInputEvents } from "cc";
import { LayerBase } from "./base";
const { ccclass, property } = _decorator;

export default class LayerLaunch extends LayerBase {
  constructor() {
    super("__LayerLaunch__");
    this.addComponent(BlockInputEvents);
  }
}
