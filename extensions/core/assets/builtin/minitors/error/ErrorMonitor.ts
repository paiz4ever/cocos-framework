import { NATIVE } from "cc/env";

export default class ErrorMonitor {
  static init() {
    try {
      if (NATIVE) {
        (jsb as any).onError(function (location, message, stack) {
          console.warn("catch error", location, message, stack);
        });
      } else {
        window.addEventListener("error", (evt) => {
          console.warn("catch error", evt);
        });
        window.addEventListener("unhandledrejection", function (evt) {
          console.log("catch rejection:", evt);
          evt.preventDefault();
        });
      }
    } catch (e) {
      console.warn("ErrorMonitor init error: ", e);
    }
  }
}
