declare global {
  interface Array<T> {
    /**
     * 打乱数组
     * @notice 不影响原数组
     */
    shuffle(): Array<T>;
    /**
     * 数组去重
     * @notice 不影响原数组
     */
    unique(): Array<T>;
    /**
     * 获取最后一个
     */
    last(): T | undefined;
  }
}

// 使文件成为一个模块，以防止全局污染
// 非模块将无法获得类型提示
export {};
