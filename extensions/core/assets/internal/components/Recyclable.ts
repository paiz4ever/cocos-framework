import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

export default abstract class Recyclable extends Component {
  abstract onRecycle(): void;
}
