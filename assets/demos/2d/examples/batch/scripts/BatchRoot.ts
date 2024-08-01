/**
 * FAQ
 * 1. 为什么不直接给容器添加UIOpacity组件？
 * 因为子节点不是prefab将被跳过合批，如果容器添加了UIOpacity会导致这些被跳过的子节点无法渲染
 *
 */

import {
  _decorator,
  Component,
  director,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  UIOpacity,
  UIRenderer,
  UITransform,
} from "cc";
const { ccclass, property } = _decorator;

/**
 * 透明度组件 widget组件问题考虑进去
 */
/**
 * 注意需要阻止渲染避免首帧dc陡增现象
 * 复杂遮挡关系的处理
 */

@ccclass("BatchRoot")
export class BatchRoot extends Component {
  /**
   * 格式化节点
   * @notice 仅保留UIRenderer和UITransform
   */
  private static format(node: Node) {
    node.destroyAllChildren();
    node.components.forEach((c) => {
      if (!(c instanceof UITransform || c instanceof UIRenderer)) {
        c.destroy();
      }
    });
  }
  /**
   * 同步节点
   * // TODO
   */
  private static sync(source: Node, target: Node) {
    target.worldPosition = source.worldPosition;
    target.worldScale = source.worldScale;
    target.worldRotation = source.worldRotation;
    source.on(Node.EventType.TRANSFORM_CHANGED, () => {
      target.worldPosition = source.worldPosition;
    });
  }

  private declare dividedNode: Node;

  protected onLoad(): void {
    return;
    this.divide();
    this.classify();
  }

  /**
   * 子节点分组
   * @notice 子节点不是prefab将被跳过合批
   */
  private classify() {
    const groups: Map<string, Node[]> = new Map();
    const orders: Map<string, number> = new Map();
    function search(node: Node, order: number) {
      node.children.forEach((n) => {
        if (!n.activeInHierarchy) return;
        const prefab = (<any>n)._prefab as Prefab._utils.PrefabInfo;
        if (!prefab) return;
        search(n, order + 1);
        if (!n.getComponent(UIRenderer)) return;
        const group = groups.get(prefab.fileId) || [];
        group.push(n);
        groups.set(prefab.fileId, group);
        orders.set(prefab.fileId, order);
      });
    }
    search(this.node, 0);
    groups.forEach((group, key) => {
      const groupContainer = new Node(key);
      this.dividedNode.addChild(groupContainer);
      groupContainer.setSiblingIndex(orders.get(key)!);
      group.forEach((n) => {
        const node = instantiate(n);
        BatchRoot.format(node);
        groupContainer.addChild(node);
        BatchRoot.sync(n, node);
        n.setComponent(UIOpacity, (c) => (c.opacity = 0));
      });
    });
  }

  /** 分裂 */
  private divide() {
    const node = instantiate(this.node);
    node.name = `$Divided${this.node.name}`;
    BatchRoot.format(node);
    this.node.parent?.addChild(node);
    BatchRoot.sync(this.node, node);
    node.setSiblingIndex(this.node.getSiblingIndex());
    this.dividedNode = node;
  }
}
