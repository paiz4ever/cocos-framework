import { Node, NodePool } from "cc";
import Recyclable from "../components/Recyclable";

const pools: Map<string, NodePool> = new Map();
export function pool(key: string) {
  if (!pools.has(key)) {
    const pool = new NodePool();
    const originalClear = pool.clear;
    const originalPut = pool.put;
    pool.clear = function () {
      originalClear.call(this);
      pools.delete(key);
    };
    pool.put = function (node: Node) {
      try {
        // @ts-ignore
        node.getComponents(Recyclable).forEach((r) => r.onRecycle());
      } catch (e) {
        console.warn("node onRecycle error: ", e);
      }
      originalPut.call(this, node);
    };
    pools.set(key, pool);
    return pool;
  }
  return pools.get(key);
}
