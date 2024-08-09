import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

export default abstract class Recyclable extends Component {
  /**
   * 节点被回收后会调用此方法
   */
  abstract onRecycle(): void;
}
