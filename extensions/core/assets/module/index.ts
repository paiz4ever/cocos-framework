import { DEBUG } from "cc/env";
import * as app from "./export";

Object.defineProperty(app, "table", {
  get() {
    return app.config.tables;
  },
});
export default app as any;
if (DEBUG) (window as any)["app"] = app;
