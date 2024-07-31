type BtnOptions = {
  ms?: number;
  callback?: () => void;
};

export function btn(ms: number): MethodDecorator;
export function btn(callback: () => void): MethodDecorator;
export function btn(options: BtnOptions): MethodDecorator;
export function btn(
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void;
export function btn(arg1: any, arg2?: string, arg3?: PropertyDescriptor): any {
  let lastTime = 0;
  let ms = 2000;
  let callback: () => void;

  if (typeof arg1 === "number") {
    ms = arg1;
  } else if (typeof arg1 === "function") {
    callback = arg1;
  } else if (typeof arg1 === "object" && arg1 !== null && arg2 === undefined) {
    ms = arg1.ms || 2000;
    callback = arg1.callback;
  }

  const decorator: MethodDecorator = function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const currentTime = new Date().getTime();
      if (currentTime - lastTime < ms) {
        callback && callback();
        return;
      }
      lastTime = currentTime;
      return originalMethod.apply(this, args);
    };
  };

  if (arg2 !== undefined) {
    return decorator(arg1, arg2!, arg3!);
  } else {
    return decorator;
  }
}
