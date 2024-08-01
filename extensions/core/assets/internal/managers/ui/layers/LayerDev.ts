import { _decorator, Component, Layers, Node } from "cc";
import { LayerBase } from "./base";
const { ccclass, property } = _decorator;

export default class LayerDev extends LayerBase {
  constructor() {
    super("LayerDev");
  }
}
