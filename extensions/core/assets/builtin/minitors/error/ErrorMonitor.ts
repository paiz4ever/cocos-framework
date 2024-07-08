import { NATIVE } from "cc/env";

export default class ErrorMonitor {
  static init() {
    try {
      if (NATIVE) {
        (jsb as any).onError(function (location, message, stack) {
          console.warn("catch error", location, message, stack);
        });
      } else {
        window.addEventListener("error", (ev) => {
          console.warn("catch error", ev);
        });
        window.addEventListener("unhandledrejection", (ev) => {
          console.log("catch reject", ev);
        });
      }
    } catch (e) {
      console.warn("ErrorMonitor init error: ", e);
    }
  }
}
