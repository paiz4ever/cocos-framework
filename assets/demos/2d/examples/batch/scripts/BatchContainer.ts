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

@ccclass("BatchContainer")
export class BatchContainer extends Component {
  private declare dividedNode: Node;

  protected onLoad(): void {
    console.log("onLoad 0: ", director.root!.device.numDrawCalls);
    this.createDividedNode();
    console.log("onLoad 1: ", director.root!.device.numDrawCalls);
    this.classify();
  }

  // protected update(dt: number): void {
  //   const root = director.root;
  //   if (root) {
  //     console.log("Draw Calls: ", root.device.numDrawCalls);
  //   }
  // }

  /**
   * 子节点分组
   * @notice 子节点不是prefab将被跳过合批
   */
  private classify() {
    const groups: Map<string, Node[]> = new Map();
    const orders: Map<string, number> = new Map();
    function recur(node: Node, order: number) {
      node.children.forEach((n) => {
        if (!n.activeInHierarchy) return;
        const prefab = (<any>n)._prefab as Prefab._utils.PrefabInfo;
        if (!prefab) return;
        recur(n, order + 1);
        if (!n.getComponent(UIRenderer)) return;
        const group = groups.get(prefab.fileId) || [];
        group.push(n);
        groups.set(prefab.fileId, group);
        orders.set(prefab.fileId, order);
      });
    }
    recur(this.node, 0);
    groups.forEach((group, key) => {
      const groupContainer = new Node(key);
      this.dividedNode.addChild(groupContainer);
      groupContainer.setSiblingIndex(orders.get(key)!);
      group.forEach((n) => {
        const node = instantiate(n);
        node.destroyAllChildren();
        node.components.forEach((c) => {
          if (!(c instanceof UITransform || c instanceof UIRenderer)) {
            c.destroy();
          }
        });
        groupContainer.addChild(node);
        n.on(Node.EventType.TRANSFORM_CHANGED, () => {
          node.worldPosition = n.worldPosition;
        });
        node.worldPosition = n.worldPosition;
        node.worldScale = n.worldScale;
        node.worldRotation = n.worldRotation;
        n.setComponent(UIOpacity, (c) => (c.opacity = 0));
      });
    });
  }

  private createDividedNode() {
    const node = instantiate(this.node);
    node.name = `$Divided${this.node.name}`;
    node.getComponent(BatchContainer)?.destroy();
    node.destroyAllChildren();
    this.node.parent?.addChild(node);
    node.setSiblingIndex(this.node.getSiblingIndex());
    this.dividedNode = node;
    // TODO
    this.node.on(Node.EventType.TRANSFORM_CHANGED, () => {
      node.worldPosition = this.node.worldPosition;
    });
  }
}
