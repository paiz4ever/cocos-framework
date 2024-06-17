/** 确保一个函数一定被执行 */
function ensureSuperCall(methodName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      let superMethodCalled = false;

      // 获取父类的方法
      const superMethod = Object.getPrototypeOf(Object.getPrototypeOf(this))[
        methodName
      ];

      if (typeof superMethod !== "function") {
        throw new Error(
          `Super method ${methodName} is not found on the prototype chain.`
        );
      }

      // 包装父类的方法，用于设置标志
      const superMethodWrapper = (...superArgs: any[]) => {
        superMethodCalled = true;
        return superMethod.apply(this, superArgs);
      };

      // 保存原始的super方法
      const originalSuperMethod = this[methodName];
      // 临时替换为包装后的方法
      this[methodName] = superMethodWrapper;

      // 调用子类的方法
      const result = originalMethod.apply(this, args);

      // 恢复原始的super方法
      this[methodName] = originalSuperMethod;

      if (!superMethodCalled) {
        throw new Error(
          `super.${methodName}() must be called in ${propertyKey}`
        );
      }

      return result;
    };

    return descriptor;
  };
}
