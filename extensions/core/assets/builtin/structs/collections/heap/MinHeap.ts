/**
 * 最小堆
 */
import Heap from "./Heap";

export default class MinHeap<T> extends Heap<T> {
  /**
   * @param extractor 属性提取器。将结构中的某个属性（数字）提取用于比较，类型为 number时可缺省
   */
  constructor(extractor: (v: T) => number) {
    if (!extractor) {
      extractor = (v) => v as number;
    }
    super((a, b) => extractor(a) - extractor(b));
  }
}
