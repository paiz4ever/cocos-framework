import { DEBUG } from "cc/env";
import * as app from "./export";

// windows环境下安卓原生 app 是不可拓展对象，即 Object.isExtensible(app) 为false，因此克隆一份
const extensibleApp = { ...app };
Object.defineProperty(extensibleApp, "table", {
  get() {
    return app.config.tables;
  },
});
export default extensibleApp as any;
if (DEBUG) (window as any)["app"] = extensibleApp;
