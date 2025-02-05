/**
 * 红点系统
 * 采用树形结构统一管理红点，仅需关心叶子节点（主动节点）的红点状态即可，它的父节点（被动节点）由系统维护
 *
 * 一、使用说明：
 * 1、路径使用"|"隔开
 * 2、可以搭配红点组件使用RedDotComponent（挂载到红点上即可），也可RedDotSys.on(path)来监听红点状态
 * 3、建议使用枚举来统一管理所有的红点路径
 *
 * 二、用例：
 *    | - A1 - A11
 * A -| - A2
 *    | - A3
 * 分别通过RedDotSys.add("A|A1|A11")、RedDotSys.add("A|A2")、RedDotSys.add("A|A3")添加红点，此时A的红点数自动变为3，它是被动节点系统自动处理的
 *
 * 三、注意：
 * 1、无法重复添加同一个节点，会被跳过
 * 2、无法删除被动节点（当存在子节点时）
 * 3、如果使用RedDotSys.on(path)监听，记得使用RedDotSys.off或者RedDotSys.offTarget处理注销监听(用法同EventTarget)
 * 4、当手动添加被动节点RedDotSys.add("A")时，它是被允许的，此时它被当作主动节点。但是当它的子节点（真正的主动节点）被添加时它会被自动纠正成被动节点
 */
import { SingleEventEmitter } from "../../builtin/structs";

class RedDotNode {
  redNum = 0;
  children: Map<string, RedDotNode> = new Map();
  constructor(public key: string, public path: string = key) {}
}

class RedDotSystem extends SingleEventEmitter<{ [key: string]: number }> {
  private root = new RedDotNode("$Root");

  add(path: string): boolean {
    if (this.find(path)) {
      return false;
    }
    const keys = path.split("|");
    let curNode = this.root;
    curNode.redNum++;
    this.notify(curNode);
    keys.forEach((k, i) => {
      // 准备设置子节点时父节点redNum应该为1（上一个循环提前+1）
      if (curNode.redNum !== 1 && !curNode.children.size) {
        console.warn(
          `The parent node(${curNode.path}) should not be set separately, otherwise the system becomes chaotic.`
        );
        this.del(curNode.path);
      }
      if (!curNode.children.has(k)) {
        curNode.children.set(
          k,
          new RedDotNode(k, keys.slice(0, i + 1).join("|"))
        );
      }
      curNode = curNode.children.get(k)!;
      curNode.redNum++;
      this.notify(curNode);
    });
    return true;
  }

  find(path: string): RedDotNode | null {
    const keys = path.split("|");
    let curNode = this.root;
    for (let k of keys) {
      if (!curNode.children.has(k)) {
        return null;
      }
      curNode = curNode.children.get(k)!;
    }
    return curNode;
  }

  del(path: string): boolean {
    const target = this.find(path);
    if (!target) {
      return false;
    }
    if (target.children.size) {
      console.warn(
        `The parent node(${path}) should not be deleted separately, otherwise the system becomes chaotic.`
      );
      return false;
    }
    this.delNode(path, this.root);
    return true;
  }

  clear() {
    this.resetNode(this.root);
  }

  private notify(node: RedDotNode) {
    this.emit(node.path, node.redNum);
  }

  private delNode(path: string, node: RedDotNode) {
    const keys = path.split("|");
    if (path) {
      this.delNode(
        keys.slice(1, keys.length).join("|"),
        node.children.get(keys[0])!
      );
    }
    node.redNum--;
    this.notify(node);
    node.children.forEach((child) => {
      if (child.redNum <= 0) {
        node.children.delete(child.key);
      }
    });
  }

  private resetNode(node: RedDotNode) {
    node.children.forEach((child) => {
      this.resetNode(child);
    });
    node.redNum = 0;
    node.children.clear();
    this.notify(node);
  }
}
const RedDotSys = RedDotSystem.getInstance();
export default RedDotSys;
