import { NodePool } from "cc";

const pools: Map<string, NodePool> = new Map();
export function pool(key: string) {
  if (!pools.has(key)) {
    const pool = new NodePool();
    const originalMethod = pool.clear;
    pool.clear = function () {
      originalMethod.call(this);
      pools.delete(key);
    };
    pools.set(key, pool);
    return pool;
  }
  return pools.get(key);
}
